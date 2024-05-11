import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Areas, Curriculum, Faculty, Offer } from "../../components/types";
import { api } from "../../api/api";

interface SemesterState {
	loading: boolean;
	semester: "Fall" | "Spring";
	error: string;
	curriculum: Curriculum[];
	faculty: Faculty[];
	areas: Areas[];
	offers: Offer[];
}

const initialState: SemesterState = {
	loading: false,
	semester: "Fall",
	curriculum: [],
	faculty: [],
	areas: [],
	offers: [],
	error: "",
};

// const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCurriculum = createAsyncThunk("semester/getCurriculum", async () => {
	const response = await api.get(`/curriculum`);
	return response.data as Curriculum[];
});

export const getFaculties = createAsyncThunk("semester/getFaculty", async (semester: 'Fall' | 'Spring') => {
	const response = await api.get(`/faculties`, {
		params: { semester },
	});
	return response.data as Faculty[];
});

export const getOffers = createAsyncThunk("semester/getOffer", async () => {
	const response = await api.get(`/offers`);
	return response.data as Offer[];
});

// export const getAssign = createAsyncThunk("semester/getAssign", async (semester: 'Fall' | 'Spring') => {
// 	const response = await api.get(`/assign`, {
// 		params: { semester },
// 	});
// 	console.log(`getAssign: `, response.data);
// 	return response.data as Assign[];
// });

export const getAreas = createAsyncThunk("semester/getArea", async () => {
	const response = await api.get(`/areas`);
	return response.data as Areas[];
});

export const clearOffers = createAsyncThunk("semester/clearOffers", async () => {
	const response = await api.delete(`/clear`);
	return response.data as string;
});

export const assignOffer = createAsyncThunk("semester/assignOffer", async (offer: Offer) => {
	const response = await api.post(`/assign`, offer);
	return response.data as string;
});

export const semesterSlice = createSlice({
	name: "semester",
	initialState,
	reducers: {
		setSemester: (state, action: PayloadAction<'Fall' | 'Spring'>) => {
			state.semester = action.payload;
		},
		switchSemester: (state) => {
			state.semester = state.semester === 'Fall' ? 'Spring' : 'Fall';
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCurriculum.pending, (state) => {
				state.loading = true;
			})
			.addCase(getCurriculum.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.curriculum = payload;
			})
			.addCase(getCurriculum.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload as string;
			})
			//
			.addCase(getFaculties.pending, (state) => {
				state.loading = true;
			})
			.addCase(getFaculties.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.faculty = payload;
			})
			.addCase(getFaculties.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload as string;
			})
			//
			.addCase(getOffers.pending, (state) => {
				state.loading = true;
			})
			.addCase(getOffers.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.offers = payload;
			})
			.addCase(getOffers.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload as string;
			})
			//
			.addCase(getAreas.pending, (state) => {
				state.loading = true;
			})
			.addCase(getAreas.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.areas = payload;
			})
			.addCase(getAreas.rejected, (state, { payload }) => {
				state.loading = false;
				state.error = payload as string;
			})
	},
});

export const { setSemester, switchSemester } = semesterSlice.actions;
export const semesterReducer = semesterSlice.reducer;
