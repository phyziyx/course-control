export interface ISemester {
	sno: number;
	name: string;
}

export type SelectedCell = {
	column: number;
	section: string;
	semester: number;
};

export type Course = {
	courseid: number;
	code: string;
	title: string;
	crhr: number;
	semester: number;
};

export type Faculty = {
	fid: number;
	TeacherName: string;
	fulltime: boolean;
	alot?: number;
};

export type Props = {
	items: Faculty[];
	setFaculty: (faculty: Faculty) => void;
};

export type State = {
	suggesions: Faculty[];
	text: string;
	SelectedIndex: number;
};

export type Curriculum = {
	curid: number;
	cid: number;
	semno: number;
	title: string;
};

export type Offer = {
	semno: number;
	cid: number;
	fid: number;
	sec: string;
	semester: string;
};

export type Areas = {
	cid: number;
	fid: number;
}

export type Assign = {
	fid: number;
	assign: number;
}