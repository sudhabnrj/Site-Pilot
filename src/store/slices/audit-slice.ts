import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IAuditReport } from "@/models/audit.model";

export interface AuditState {
  currentReport: IAuditReport | null;
  reportsHistory: IAuditReport[];
  isAuditing: boolean;
  progressStage: string;
  progressPercentage: number;
  isLoadingHistory: boolean;
  error: string | null;
  fixedRecommendationIds: string[];
  fixedIssueIds: string[];
}

const initialState: AuditState = {
  currentReport: null,
  reportsHistory: [],
  isAuditing: false,
  progressStage: "",
  progressPercentage: 0,
  isLoadingHistory: false,
  error: null,
  fixedRecommendationIds: [],
  fixedIssueIds: [],
};

// Async Thunk: Execute Audit
export const executeAudit = createAsyncThunk(
  "audit/executeAudit",
  async (url: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setAuditStage({ stage: "Fetching Website...", percentage: 15 }));
      await new Promise((r) => setTimeout(r, 400));

      dispatch(setAuditStage({ stage: "Analyzing SEO...", percentage: 35 }));
      await new Promise((r) => setTimeout(r, 400));

      dispatch(setAuditStage({ stage: "Checking Accessibility...", percentage: 55 }));
      await new Promise((r) => setTimeout(r, 400));

      dispatch(setAuditStage({ stage: "Analyzing Performance...", percentage: 75 }));
      await new Promise((r) => setTimeout(r, 400));

      dispatch(setAuditStage({ stage: "Generating AI Insights...", percentage: 90 }));

      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to complete website audit.");
      }

      dispatch(setAuditStage({ stage: "Saving Report...", percentage: 98 }));
      await new Promise((r) => setTimeout(r, 300));

      dispatch(setAuditStage({ stage: "Complete!", percentage: 100 }));
      return data.report as IAuditReport;
    } catch (err: any) {
      return rejectWithValue(err.message || "An unexpected error occurred during audit.");
    }
  }
);

// Async Thunk: Fetch User Audits
export const fetchUserAudits = createAsyncThunk(
  "audit/fetchUserAudits",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/audit");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch audit history.");
      }
      return data.reports as IAuditReport[];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load audit history.");
    }
  }
);

// Async Thunk: Delete Audit Report
export const deleteAuditReport = createAsyncThunk(
  "audit/deleteAuditReport",
  async (reportId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/audit/${reportId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete report.");
      }
      return reportId;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete audit report.");
    }
  }
);

// Async Thunk: Fix Audit Issue (removes from backend and frontend)
export const fixAuditIssue = createAsyncThunk(
  "audit/fixAuditIssue",
  async (
    { reportId, recommendationId, issueKeyword }: { reportId: string; recommendationId: string; issueKeyword: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`/api/audit/${reportId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "fix", recommendationId, issueKeyword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit fix to backend.");
      }
      return data.report as IAuditReport;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to submit fix.");
    }
  }
);

const auditSlice = createSlice({
  name: "audit",
  initialState,
  reducers: {
    setAuditStage(
      state,
      action: PayloadAction<{ stage: string; percentage: number }>
    ) {
      state.progressStage = action.payload.stage;
      state.progressPercentage = action.payload.percentage;
    },
    setCurrentReport(state, action: PayloadAction<IAuditReport | null>) {
      state.currentReport = action.payload;
    },
    clearAuditError(state) {
      state.error = null;
    },
    applyTemporaryFix(
      state,
      action: PayloadAction<{ recommendationId: string; issueKeyword?: string }>
    ) {
      state.fixedRecommendationIds.push(action.payload.recommendationId);
      if (action.payload.issueKeyword) {
        // Find issue matches to filter out of issues list too
        const keyword = action.payload.issueKeyword.toLowerCase();
        const matchingIssues = state.currentReport?.issues?.filter((i) =>
          i.issue.toLowerCase().includes(keyword) || keyword.includes(i.issue.toLowerCase())
        ) || [];
        matchingIssues.forEach((issue) => {
          if (issue.id) {
            state.fixedIssueIds.push(issue.id);
          }
        });
      }
    },
    clearTemporaryFixes(state) {
      state.fixedRecommendationIds = [];
      state.fixedIssueIds = [];
    },
  },
  extraReducers: (builder) => {
    // Execute Audit
    builder.addCase(executeAudit.pending, (state) => {
      state.isAuditing = true;
      state.error = null;
      state.progressStage = "Fetching Website...";
      state.progressPercentage = 10;
      state.fixedRecommendationIds = [];
      state.fixedIssueIds = [];
    });
    builder.addCase(executeAudit.fulfilled, (state, action) => {
      state.isAuditing = false;
      state.currentReport = action.payload;
      state.reportsHistory = [action.payload, ...state.reportsHistory.filter((r) => r._id !== action.payload._id)];
      state.progressStage = "Complete";
      state.progressPercentage = 100;
      state.fixedRecommendationIds = [];
      state.fixedIssueIds = [];
    });
    builder.addCase(executeAudit.rejected, (state, action) => {
      state.isAuditing = false;
      state.error = (action.payload as string) || "Failed to audit website.";
      state.progressStage = "";
      state.progressPercentage = 0;
    });

    // Fetch History
    builder.addCase(fetchUserAudits.pending, (state) => {
      state.isLoadingHistory = true;
    });
    builder.addCase(fetchUserAudits.fulfilled, (state, action) => {
      state.isLoadingHistory = false;
      state.reportsHistory = action.payload;
      if (!state.currentReport && action.payload.length > 0) {
        state.currentReport = action.payload[0];
      }
    });
    builder.addCase(fetchUserAudits.rejected, (state) => {
      state.isLoadingHistory = false;
    });

    // Delete Report
    builder.addCase(deleteAuditReport.fulfilled, (state, action) => {
      state.reportsHistory = state.reportsHistory.filter((r) => r._id !== action.payload);
      if (state.currentReport && state.currentReport._id === action.payload) {
        state.currentReport = state.reportsHistory[0] || null;
      }
    });

    // Fix Issue
    builder.addCase(fixAuditIssue.fulfilled, (state, action) => {
      state.currentReport = action.payload;
      state.reportsHistory = state.reportsHistory.map((r) =>
        r._id === action.payload._id ? action.payload : r
      );
    });
  },
});

export const {
  setAuditStage,
  setCurrentReport,
  clearAuditError,
  applyTemporaryFix,
  clearTemporaryFixes,
} = auditSlice.actions;
export default auditSlice.reducer;
