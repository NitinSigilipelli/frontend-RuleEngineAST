import React from 'react';

const ResultsDisplay = ({ result }) => {
    if (!result) {
        return   
    }

    return (
        <div className="my-8">
            <h2 className="text-xl font-semibold">Evaluation Result:</h2>
            <p className="text-base mt-2">{JSON.stringify(result)}</p>
        </div>
    );
};

export default ResultsDisplay;
