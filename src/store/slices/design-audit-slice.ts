import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { DesignAuditReportItem } from "@/types/design-audit";

interface DesignAuditState {
  reports: DesignAuditReportItem[];
  currentReport: DesignAuditReportItem | null;
  isLoading: boolean;
  isExecutingAudit: boolean;
  auditProgressStep: number;
  auditProgressMessage: string;
  error: string | null;
  searchQuery: string;
  selectedFilter: string;
}

const initialState: DesignAuditState = {
  reports: [],
  currentReport: null,
  isLoading: false,
  isExecutingAudit: false,
  auditProgressStep: 0,
  auditProgressMessage: "",
  error: null,
  searchQuery: "",
  selectedFilter: "all",
};

export const fetchDesignAudits = createAsyncThunk(
  "designAudit/fetchDesignAudits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/design-audit");
      const data = await response.json();
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to fetch design audit history.");
      }
      return data.reports as DesignAuditReportItem[];
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error fetching design audits.");
    }
  }
);

export const runDesignAudit = createAsyncThunk(
  "designAudit/runDesignAudit",
  async (
    payload: { websiteUrl: string; figmaUrl?: string; uploadedScreenshot?: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(setAuditProgress({ step: 1, message: "Validating input sources and URL formatting..." }));
      await new Promise((r) => setTimeout(r, 400));

      dispatch(setAuditProgress({ step: 2, message: "Connecting to Figma REST API & extracting design tokens..." }));
      await new Promise((r) => setTimeout(r, 600));

      dispatch(setAuditProgress({ step: 3, message: "Capturing website viewports (Desktop, Tablet, Mobile)..." }));
      await new Promise((r) => setTimeout(r, 800));

      dispatch(setAuditProgress({ step: 4, message: "Extracting DOM computed styles & element bounding rects..." }));
      await new Promise((r) => setTimeout(r, 600));

      dispatch(setAuditProgress({ step: 5, message: "Generating pixel-by-pixel diff mask & visual heatmaps..." }));
      await new Promise((r) => setTimeout(r, 600));

      dispatch(setAuditProgress({ step: 6, message: "Running AI Vision defect detection on typography, layout & colors..." }));
      await new Promise((r) => setTimeout(r, 700));

      dispatch(setAuditProgress({ step: 7, message: "Computing composite scores & generating actionable CSS fixes..." }));

      const response = await fetch("/api/design-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message || "Failed to execute AI Design Audit.");
      }

      return data.report as DesignAuditReportItem;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error running AI Design Audit.");
    }
  }
);

export const deleteDesignAudit = createAsyncThunk(
  "designAudit/deleteDesignAudit",
  async (reportId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/design-audit/${reportId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!data.success) {
        return rejectWithValue(data.message || "Failed to delete report.");
      }
      return reportId;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error deleting audit report.");
    }
  }
);

const designAuditSlice = createSlice({
  name: "designAudit",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedFilter: (state, action: PayloadAction<string>) => {
      state.selectedFilter = action.payload;
    },
    setCurrentReport: (state, action: PayloadAction<DesignAuditReportItem | null>) => {
      state.currentReport = action.payload;
    },
    setAuditProgress: (
      state,
      action: PayloadAction<{ step: number; message: string }>
    ) => {
      state.auditProgressStep = action.payload.step;
      state.auditProgressMessage = action.payload.message;
    },
    resetProgress: (state) => {
      state.isExecutingAudit = false;
      state.auditProgressStep = 0;
      state.auditProgressMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDesignAudits
      .addCase(fetchDesignAudits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDesignAudits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
        if (!state.currentReport && action.payload.length > 0) {
          state.currentReport = action.payload[0];
        }
      })
      .addCase(fetchDesignAudits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // runDesignAudit
      .addCase(runDesignAudit.pending, (state) => {
        state.isExecutingAudit = true;
        state.error = null;
      })
      .addCase(runDesignAudit.fulfilled, (state, action) => {
        state.isExecutingAudit = false;
        state.reports.unshift(action.payload);
        state.currentReport = action.payload;
        state.auditProgressStep = 7;
        state.auditProgressMessage = "Audit Completed!";
      })
      .addCase(runDesignAudit.rejected, (state, action) => {
        state.isExecutingAudit = false;
        state.error = action.payload as string;
        state.auditProgressStep = 0;
      })

      // deleteDesignAudit
      .addCase(deleteDesignAudit.fulfilled, (state, action) => {
        state.reports = state.reports.filter(
          (r) => (r._id || r.id) !== action.payload
        );
        if (
          state.currentReport &&
          (state.currentReport._id || state.currentReport.id) === action.payload
        ) {
          state.currentReport = state.reports[0] || null;
        }
      });
  },
});

export const {
  setSearchQuery,
  setSelectedFilter,
  setCurrentReport,
  setAuditProgress,
  resetProgress,
} = designAuditSlice.actions;

export const designAuditReducer = designAuditSlice.reducer;
