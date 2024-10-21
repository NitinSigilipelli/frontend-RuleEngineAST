import React, { useState } from 'react';
import RuleForm from './components/RuleForm';
import ResultsDisplay from './components/ResultDisplay';

const App = () => {
    const [result, setResult] = useState(null); // State to hold the result

    // Function to handle evaluation and update result
    const handleEvaluate = (evaluationResult) => {
        setResult(evaluationResult);
    };

    return (
        <div style={{ padding: '16px' }}>
            <h1>Rule Engine App</h1>
            <RuleForm onEvaluate={handleEvaluate} />
            <ResultsDisplay result={result} />
        </div>
    );
};

export default App;
