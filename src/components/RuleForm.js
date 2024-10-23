import React, { useState } from 'react';
import axios from 'axios';

const RuleForm = ({ onEvaluate }) => {
    const [selectedAction, setSelectedAction] = useState('evaluate');
    const [rule, setRule] = useState('');
    const [userData, setUserData] = useState({
        age: '',
        department: '',
        salary: '',
        experience: '',
    });
    const [combinedRules, setCombinedRules] = useState([]);
    const [combineOperator, setCombineOperator] = useState('AND');
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // State for handling errors

    // State for displaying the submitted data
    const [submittedData, setSubmittedData] = useState(null);

    const handleActionChange = (e) => {
        setSelectedAction(e.target.value);
        resetForm();
    };

    const resetForm = () => {
        setRule('');
        setCombinedRules([]);
        setUserData({
            age: '',
            department: '',
            salary: '',
            experience: '',
        });
        setEvaluationResult(null);
        setSubmittedData(null);
        setError(null); // Reset error state
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Reset error before the request
        try {
            const response = await axios.post('http://localhost:8081/api/rules/create', {
                ruleString: rule,
            });
            setEvaluationResult(response.data);
            setSubmittedData({ type: 'Rule Created', rule }); // Store submitted data
            onEvaluate(response.data);
        } catch (error) {
            handleError(error, 'creating the rule');
        } finally {
            setLoading(false);
        }
    };

    const handleCombine = async () => {
        setLoading(true);
        setError(null); // Reset error before the request
        try {
            const response = await axios.post('http://localhost:8081/api/rules/combine', {
                ruleStrings: combinedRules,
                operator: combineOperator,
            });
            // Store the response data for display
            setEvaluationResult(response.data);
            setSubmittedData({ type: 'Combined Rules', combinedRules, combineOperator, response: response.data }); // Store combined rules and response
        } catch (error) {
            handleError(error, 'combining the rules');
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluate = async () => {
        setLoading(true);
        setError(null); // Reset error before the request
        try {
            const response = await axios.post('http://localhost:8081/api/rules/evaluate', {
                ruleString: rule,
                userData: Object.values(userData),
            });

            // Log the entire response to inspect its structure
            console.log('Evaluation Response:', response);

            // Check if `response.data.result` exists, else use the entire `response.data`
            const result = response.data.result ? response.data.result : response.data;
            
            // Set the evaluation result
            setEvaluationResult(result);
            setSubmittedData({ type: 'Rule Evaluation', userData, rule }); // Store user data and rule for display
            onEvaluate(result);
        } catch (error) {
            handleError(error, 'evaluating the rule');
        } finally {
            setLoading(false);
        }
    };

    // Handle errors and set error state
    const handleError = (error, action) => {
        if (error.response) {
            // Server responded with a status outside the 2xx range
            setError(`Error ${action}: ${error.response.data.message || 'Server error'}`);
        } else if (error.request) {
            // Request was made but no response was received
            setError(`Error ${action}: No response received from server`);
        } else {
            // Something else happened while setting up the request
            setError(`Error ${action}: ${error.message}`);
        }
    };

    const renderEvaluationResult = () => {
        if (evaluationResult === null) return null;
    
        return (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800">Result:</h4>
                {typeof evaluationResult === 'boolean' ? (
                    <p className={evaluationResult ? "text-green-700 mt-2" : "text-red-700 mt-2"}>
                        <strong>{evaluationResult ? 'True' : 'False'}</strong>
                    </p>
                ) : (
                    <pre className="text-gray-700 mt-2 whitespace-pre-wrap">
                        {JSON.stringify(evaluationResult, null, 2)}
                    </pre>
                )}
            </div>
        );
    };
    

    const renderSubmittedData = () => {
        if (!submittedData) return null;

        return (
            <div className="mt-8 p-6 bg-green-100 border border-green-500 rounded-lg">
                <h3 className="text-2xl font-semibold text-green-800 mb-4">Submitted Data:</h3>
                <p className="text-green-700"><strong>Action:</strong> {submittedData.type}</p>
                {submittedData.type === 'Rule Created' && (
                    <p className="mt-2 text-green-700"><strong>Rule:</strong> {submittedData.rule}</p>
                )}
                {submittedData.type === 'Combined Rules' && (
                    <>
                        <p className="mt-2 text-green-700"><strong>Combined Rules:</strong> {submittedData.combinedRules.join(', ')}</p>
                        <p className="text-green-700"><strong>Operator:</strong> {submittedData.combineOperator}</p>
                    </>
                )}
                {submittedData.type === 'Rule Evaluation' && (
                    <>
                        <p className="mt-2 text-green-700"><strong>User Data:</strong></p>
                        <ul className="ml-4 list-disc text-green-700">
                            {Object.entries(submittedData.userData).map(([key, value]) => (
                                <li key={key}><strong>{key}:</strong> {value}</li>
                            ))}
                        </ul>
                        <p className="mt-2 text-green-700"><strong>Evaluated Rule:</strong> {submittedData.rule}</p>
                    </>
                )}
            </div>
        );
    };

    const renderError = () => {
        if (!error) return null;
        return (
            <div className="mt-4 p-4 bg-red-100 border border-red-500 rounded-lg">
                <p className="text-red-700 font-semibold">Error: {error}</p>
            </div>
        );
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Rule Engine</h2>

            {/* Action Selection Dropdown */}
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="action-select">
                    Select Action:
                </label>
                <select
                    id="action-select"
                    value={selectedAction}
                    onChange={handleActionChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="create">Create Rule</option>
                    <option value="combine">Combine Rules</option>
                    <option value="evaluate">Evaluate Rule</option>
                </select>
            </div>

            {/* Action-based form rendering */}
            {selectedAction === 'create' && (
                <form onSubmit={handleSubmit} className="mb-6">
                    <input
                        type="text"
                        placeholder="Enter rule"
                        value={rule}
                        onChange={(e) => setRule(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    />
                    <button
                        type="submit"
                        className={`w-full py-3 text-white font-semibold rounded-lg transition duration-200 ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Rule'}
                    </button>
                </form>
            )}

            {selectedAction === 'combine' && (
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Combine Rules</h4>
                    <input
                        type="text"
                        placeholder="Comma-separated rule strings"
                        onChange={(e) => setCombinedRules(e.target.value.split(','))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    />
                    <label htmlFor="operator-select" className="block text-gray-700 text-sm font-bold mb-2">
                        Select Operator:
                    </label>
                    <select
                        id="operator-select"
                        value={combineOperator}
                        onChange={(e) => setCombineOperator(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                    </select>
                    <button
                        type="button"
                        onClick={handleCombine}
                        className={`w-full mt-4 py-3 text-white font-semibold rounded-lg transition duration-200 ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                        disabled={loading}
                    >
                        {loading ? 'Combining...' : 'Combine Rules'}
                    </button>
                </div>
            )}

            {selectedAction === 'evaluate' && (
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Evaluate Rule</h4>
                    <input
                        type="text"
                        placeholder="Enter rule"
                        value={rule}
                        onChange={(e) => setRule(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        {['age', 'department', 'salary', 'experience'].map((field) => (
                            <div key={field} className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 capitalize" htmlFor={field}>
                                    {field}
                                </label>
                                <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    value={userData[field]}
                                    onChange={handleInputChange}
                                    placeholder={`Enter ${field}`}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleEvaluate}
                        className={`w-full py-3 text-white font-semibold rounded-lg transition duration-200 ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                        disabled={loading}
                    >
                        {loading ? 'Evaluating...' : 'Evaluate Rule'}
                    </button>
                </div>
            )}

            {/* Display evaluation results */}
            {renderEvaluationResult()}

            {/* Display submitted data */}
            {renderSubmittedData()}

            {/* Display errors if any */}
            {renderError()}
        </div>
    );
};

export default RuleForm;