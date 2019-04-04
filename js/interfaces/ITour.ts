import * as React from 'react';

export interface ITourState {
    foundTarget: boolean;
    style: React.CSSProperties;
}

export interface ITourProps {
    tour: ITour;
    stepIndex: number;
}

export interface ITour {
    id: string;
    steps: ITourStep[];
    currentStep: number;
}

export interface ITourStep {
    target: string;
    title: string;
    content: string;
    placement: string;
    showNext: boolean;
    showBack: boolean;
    offset: number;
    align: string;
    order: number;
    querySelector: boolean;
}
