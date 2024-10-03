import React, { useState } from "react";

export interface Transcript {
    courses: Course[];

    addCourse: (course: Course) => void;

    getAvgScore: () => number;
}

export class TranscriptImpl implements Transcript {
    courses: Course[];

    constructor(courses: Course[]) {
        this.courses = courses;
    }

    addCourse(course: Course) {
        this.courses.push(course);
    }

    getAvgScore() {
        return this.courses.reduce((acc, course) => acc + course.score, 0) / this.courses.length;
    }
}

export interface Course {
    name: string;
    score: number;
}

export function calculateScholarship(transcript: Transcript): number {
    if (transcript.courses.length === 0) return 0;

    const avgScore = transcript.getAvgScore();
    if (avgScore >= 90) {
        return 1000;
    } else if (avgScore >= 80) {
        return 500;
    } else if (avgScore >= 70) {
        return 200;
    } else if (avgScore >= 60) {
        return 100;
    }
    return 0;
}

const CourseInput = ({ onAddCourse }: { onAddCourse: (course: Course) => void }) => {
    const [courseName, setCourseName] = useState<string>("");
    const [courseScore, setCourseScore] = useState<number>(0);

    return <div>
        <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Course Name" />
        <input type="number" value={courseScore} onChange={(e) => setCourseScore(Number(e.target.value))} placeholder="Course Score" />
        <button onClick={() => {
            const course = {
                name: courseName,
                score: courseScore
            };
            onAddCourse(course);
        }}>Add Course</button>
    </div>;
};

const ScholarshipCalc = () => {
    const [transcript, setTranscript] = useState<Transcript>(new TranscriptImpl([]));

    const handleAddCourse = (course: Course) => {
        const newTranscript = new TranscriptImpl(transcript.courses);
        newTranscript.addCourse(course);
        setTranscript(newTranscript);
    };

    const scholarship = transcript.courses.length === 0 ? 0 : calculateScholarship(transcript);

    return <div>
        <h1>Scholarship Calculator</h1>
        <div>
            <h2>Transcript</h2>
            <CourseInput onAddCourse={handleAddCourse} />
            {transcript && (
                <div>
                    <h2>Transcript Scholarship</h2>
                    <div>
                        <p>Total Credits: {transcript.courses.length}</p>
                        <p>Scholarship: {scholarship}</p>
                    </div>
                </div>
            )}
            <div>
                {transcript?.courses.map((course) => (
                    <div key={course.name}>
                        <p>{course.name}</p>
                        <p>{course.score}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>;
};

export default ScholarshipCalc;
