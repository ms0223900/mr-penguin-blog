import React from 'react';
import { calculateScholarship, Transcript, TranscriptImpl } from './ScholarshipCalc';
import { render, screen, fireEvent } from '@testing-library/react';
import ScholarshipCalc from './ScholarshipCalc';

describe('calculateScholarship', () => {
    it('should return 0 when transcript courses are empty', () => {
        const transcript: Transcript = new TranscriptImpl([]);
        expect(calculateScholarship(transcript)).toBe(0);
    });

    it('should return 0 when transcript courses average does not fulfill scholarship conditions', () => {
        const transcript: Transcript = new TranscriptImpl([
            { name: 'Course 1', score: 50 },
            { name: 'Course 2', score: 60 }
        ]);
        expect(calculateScholarship(transcript)).toBe(0);
    });

    it('should return 100 when transcript courses average fulfills scholarship condition', () => {
        const transcript: Transcript = new TranscriptImpl([
            { name: 'Course 1', score: 60 },
            { name: 'Course 2', score: 62 }
        ]);
        expect(calculateScholarship(transcript)).toBe(100);
    });
});


describe('ScholarshipCalc Integration Tests', () => {
    it('should display 0 scholarship when no courses are added', () => {
        render(<ScholarshipCalc />);
        expect(screen.getByText('Scholarship: 0')).toBeInTheDocument();
    });

    it('should display 0 scholarship when courses average does not fulfill scholarship conditions', () => {
        render(<ScholarshipCalc />);

        // Add Course 1
        fireEvent.change(screen.getByPlaceholderText('Course Name'), { target: { value: 'Course 1' } });
        fireEvent.change(screen.getByPlaceholderText('Course Score'), { target: { value: '50' } });
        fireEvent.click(screen.getByText('Add Course'));

        // Add Course 2
        fireEvent.change(screen.getByPlaceholderText('Course Name'), { target: { value: 'Course 2' } });
        fireEvent.change(screen.getByPlaceholderText('Course Score'), { target: { value: '55' } });
        fireEvent.click(screen.getByText('Add Course'));

        expect(screen.getByText('Scholarship: 0')).toBeInTheDocument();
    });

    it('should display 100 scholarship when courses average fulfills scholarship condition', () => {
        render(<ScholarshipCalc />);

        // Add Course 1
        fireEvent.change(screen.getByPlaceholderText('Course Name'), { target: { value: 'Course 1' } });
        fireEvent.change(screen.getByPlaceholderText('Course Score'), { target: { value: '60' } });
        fireEvent.click(screen.getByText('Add Course'));

        // Add Course 2
        fireEvent.change(screen.getByPlaceholderText('Course Name'), { target: { value: 'Course 2' } });
        fireEvent.change(screen.getByPlaceholderText('Course Score'), { target: { value: '62' } });
        fireEvent.click(screen.getByText('Add Course'));

        expect(screen.getByText('Scholarship: 100')).toBeInTheDocument();
    });
});