import React, { useState, useEffect, useRef } from 'react';

// Main App component
const App = () => {
    // State variables for the algorithm's execution and UI
    const [inputArrayStr, setInputArrayStr] = useState(''); // User input for the array as a string
    const [array, setArray] = useState([]); // The array being processed
    const [candidate, setCandidate] = useState(null); // The current candidate for the majority element
    const [count, setCount] = useState(0); // The count for the current candidate
    const [currentIndex, setCurrentIndex] = useState(-1); // Index of the element currently being processed
    const [phase, setPhase] = useState('input'); // Current phase: 'input', 'candidate_selection', 'verification', 'done'
    const [verificationCount, setVerificationCount] = useState(0); // Count for verification phase
    const [result, setResult] = useState(''); // Final result message
    const [isAnimating, setIsAnimating] = useState(false); // Controls automatic animation
    const animationTimeoutRef = useRef(null); // Ref to store animation timeout ID
    const [inputError, setInputError] = useState(''); // State for input validation error messages
    const [showCelebration, setShowCelebration] = useState(false); // State to trigger celebration effect

    // Refs for different sections
    const visualizerRef = useRef(null); // Ref for the array + state displays area
    const resultRef = useRef(null); // Ref for the result display area

    // Tailwind CSS classes for styling
    const containerClasses = "min-h-screen bg-gray-900 text-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans";
    const cardClasses = "bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out";
    const inputClasses = "w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg text-gray-200";
    const buttonClasses = "px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md";
    const primaryButtonClasses = `${buttonClasses} bg-purple-600 hover:bg-purple-700 text-white`;
    const secondaryButtonClasses = `${buttonClasses} bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600`;
    const arrayElementClasses = "flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg text-xl sm:text-2xl font-bold transition-all duration-300 ease-in-out shadow-lg";
    const currentElementClass = "ring-4 ring-yellow-400 bg-yellow-600 text-yellow-50";
    const processedElementClass = "bg-gray-600 text-gray-300";
    const defaultElementClass = "bg-blue-600 text-blue-50";
    const candidateDisplayClasses = "bg-green-700 text-green-50 p-4 rounded-xl shadow-inner text-2xl sm:text-3xl font-mono flex items-center justify-center";
    const countDisplayClasses = "bg-red-700 text-red-50 p-4 rounded-xl shadow-inner text-2xl sm:text-3xl font-mono flex items-center justify-center";
    // Celebration effect for result
    const resultDisplayClasses = `text-center text-3xl sm:text-4xl font-extrabold text-teal-400 mt-6 ${showCelebration ? 'animate-celebrate' : ''}`;
    const errorClasses = "text-red-400 text-base text-center mt-2";

    // CSS for celebration effect (using a simple pulse for sprinkles)
    // You'd typically put this in index.css, but for self-containment, it's here.
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes celebrate {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-celebrate {
                animation: celebrate 0.8s ease-in-out infinite alternate;
                text-shadow: 0 0 10px rgba(74, 222, 128, 0.7), 0 0 20px rgba(74, 222, 128, 0.5); /* Glowing effect */
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);


    // Function to initialize or reset the algorithm state
    const initializeAlgorithm = () => {
        // Clear previous animation if any
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
            animationTimeoutRef.current = null;
        }
        setIsAnimating(false); // Stop animation
        setShowCelebration(false); // Reset celebration state

        // Parse and validate the input array string
        try {
            const parsedArray = inputArrayStr.split(',').map(s => {
                const trimmed = s.trim();
                if (trimmed === '') return null; // Handle empty strings from consecutive commas
                // Try converting to number, if fails, keep as string
                const num = Number(trimmed);
                return isNaN(num) ? trimmed : num;
            }).filter(item => item !== null); // Filter out nulls from empty strings

            if (parsedArray.length === 0) {
                setInputError('Please enter a comma-separated list of values.');
                setArray([]);
                setPhase('input');
                return;
            }

            setArray(parsedArray);
            setCandidate(null);
            setCount(0);
            setCurrentIndex(0);
            setPhase('candidate_selection');
            setVerificationCount(0);
            setResult('');
            setInputError(''); // Clear any previous errors

            // If the array has only one element, it's immediately the majority candidate
            if (parsedArray.length === 1) {
                setCandidate(parsedArray[0]);
                setCount(1);
                setCurrentIndex(0); // Still show the element being processed
                // Automatically transition to verification or result if animation is off
                if (!isAnimating) {
                    setPhase('verification');
                    setVerificationCount(1);
                }
            }
        } catch (e) {
            setInputError('Invalid input. Please use comma-separated values (e.g., 1,2,3 or apple,banana).');
            setArray([]);
            setPhase('input');
        }
    };

    // Main logic for advancing the algorithm step-by-step
    const handleNextStep = () => {
        // If starting from input phase, initialize and then let the useEffect handle scroll
        if (phase === 'input' && array.length === 0 && inputArrayStr.trim() !== '') {
            initializeAlgorithm();
            // Don't scroll here directly, let the useEffect for phase/array changes handle it
            return;
        }

        if (phase === 'done') {
            return; // Algorithm finished
        }

        const n = array.length;

        // Phase 1: Candidate Selection
        if (phase === 'candidate_selection') {
            if (currentIndex < n) {
                const currentElement = array[currentIndex];

                if (count === 0) {
                    setCandidate(currentElement);
                    setCount(1);
                } else if (currentElement === candidate) {
                    setCount(prevCount => prevCount + 1);
                } else {
                    setCount(prevCount => prevCount - 1);
                }
                setCurrentIndex(prevIndex => prevIndex + 1);

                // If candidate selection is complete, move to verification
                if (currentIndex + 1 >= n) {
                    setPhase('verification');
                    setCurrentIndex(0); // Reset index for the second pass
                    setVerificationCount(0); // Reset verification count
                }
            }
        }
        // Phase 2: Candidate Verification
        else if (phase === 'verification') {
            if (currentIndex < n) {
                const currentElement = array[currentIndex];
                if (currentElement === candidate) {
                    setVerificationCount(prevCount => prevCount + 1);
                }
                setCurrentIndex(prevIndex => prevIndex + 1);

                // If verification is complete, set the final result
                if (currentIndex + 1 >= n) {
                    setPhase('done');
                    // Ensure verification count is accurate by adding the last element's contribution
                    const finalVerificationCount = verificationCount + (array[currentIndex] === candidate ? 1 : 0);
                    if (candidate !== null && finalVerificationCount > n / 2) {
                        setResult(`Majority Element: ${candidate}`);
                        setShowCelebration(true); // Trigger celebration
                    } else {
                        setResult('No Majority Element Found (> N/2)');
                        setShowCelebration(false); // Ensure no celebration
                    }
                    setIsAnimating(false); // Stop animation when done

                    // Scroll to result area
                    if (resultRef.current) {
                        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        }
    };

    // Effect for automatic animation
    useEffect(() => {
        if (isAnimating && phase !== 'done') {
            animationTimeoutRef.current = setTimeout(handleNextStep, 800); // Adjust delay as needed
        } else if (phase === 'done' || !isAnimating) {
            // Clear timeout if animation stops or algorithm finishes
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
                animationTimeoutRef.current = null;
            }
        }
        return () => {
            // Cleanup on component unmount or re-render
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, [isAnimating, phase, currentIndex, candidate, count, verificationCount, array, inputArrayStr]);

    // NEW: Effect to scroll to visualizer area when it becomes active/visible
    useEffect(() => {
        // Scroll when phase moves from 'input' AND array is populated
        if (visualizerRef.current && phase !== 'input' && array.length > 0) {
            visualizerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [phase, array.length]); // Dependencies to trigger this effect

    // Handle input change
    const handleInputChange = (e) => {
        setInputArrayStr(e.target.value);
        setInputError(''); // Clear error on input change
        // Reset to initial state when input changes
        setArray([]);
        setCandidate(null);
        setCount(0);
        setCurrentIndex(-1);
        setPhase('input');
        setVerificationCount(0);
        setResult('');
        setIsAnimating(false);
        setShowCelebration(false); // Reset celebration on input change
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
            animationTimeoutRef.current = null;
        }
    };

    // Handle animation toggle
    const toggleAnimation = () => {
        // If currently in input phase, initialize the algorithm
        if (phase === 'input') {
            initializeAlgorithm();
            // Only proceed to set animating if initialization was successful and array is valid
            if (inputArrayStr.trim() !== '' && inputArrayStr.split(',').filter(s => s.trim() !== '').length > 0) {
                 setIsAnimating(true);
            }
        } else {
            setIsAnimating(prev => !prev); // Toggle animation state
        }
        // The scrolling for visualization start is now handled by the new useEffect
    };


    // Render the UI
    return (
        <div className={containerClasses}>
            <div className={cardClasses}>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" style={{ lineHeight: '1.5em' }}>
                    Moore's Voting Algorithm Visualizer
                </h1>

                {/* Input Section */}
                <div className="mb-6">
                    <label htmlFor="array-input" className="block text-xl font-medium mb-2 text-gray-300">
                        Enter comma-separated values:
                    </label>
                    <input
                        id="array-input"
                        type="text"
                        value={inputArrayStr}
                        onChange={handleInputChange}
                        placeholder="e.g., 3,3,4,2,4,4,2,4,4 or apple,banana,apple"
                        className={inputClasses}
                        disabled={phase !== 'input' && phase !== 'done'}
                    />
                    {inputError && <p className={errorClasses}>{inputError}</p>}
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        <button
                            onClick={() => { setInputArrayStr('3,3,4,2,4,4,2,4,4'); initializeAlgorithm(); }}
                            className={secondaryButtonClasses}
                            disabled={phase !== 'input' && phase !== 'done'}
                        >
                            Example 1
                        </button>
                        <button
                            onClick={() => { setInputArrayStr('1,2,1,2,1,2,1,2,5'); initializeAlgorithm(); }}
                            className={secondaryButtonClasses}
                            disabled={phase !== 'input' && phase !== 'done'}
                        >
                            Example 2
                        </button>
                        <button
                            onClick={() => { setInputArrayStr('a,b,c,a,d'); initializeAlgorithm(); }}
                            className={secondaryButtonClasses}
                            disabled={phase !== 'input' && phase !== 'done'}
                        >
                            Example 3
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button
                        onClick={handleNextStep}
                        className={primaryButtonClasses}
                        // Disable if already animating, or if no array is loaded and no input is provided
                        disabled={isAnimating || (array.length === 0 && inputArrayStr.trim() === '') || phase === 'done'}
                    >
                        {phase === 'candidate_selection' || phase === 'verification' ? 'Next Step' : 'Start'}
                    </button>
                    <button
                        onClick={toggleAnimation}
                        className={secondaryButtonClasses}
                        disabled={phase === 'input' && array.length === 0 && inputArrayStr.trim() === ''}
                    >
                        {isAnimating ? 'Pause Animation' : 'Run Automatically'}
                    </button>
                    <button
                        onClick={() => {
                            // Stop any ongoing animation
                            if (animationTimeoutRef.current) {
                                clearTimeout(animationTimeoutRef.current);
                                animationTimeoutRef.current = null;
                            }
                            setIsAnimating(false);
                            // Reset all states
                            setArray([]);
                            setCandidate(null);
                            setCount(0);
                            setCurrentIndex(-1);
                            setPhase('input');
                            setVerificationCount(0);
                            setResult('');
                            setShowCelebration(false); // Reset celebration on full reset
                            setInputArrayStr('');
                            setInputError('');
                        }}
                        className={secondaryButtonClasses}
                    >
                        Reset
                    </button>
                </div>

                {/* Algorithm Visualization Section - This is where the visualizerRef is attached */}
                {array.length > 0 && (
                    <div ref={visualizerRef} className="mb-8 p-4 bg-gray-700 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-bold mb-4 text-gray-200 text-center">Array</h2>
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            {array.map((element, index) => (
                                <div
                                    key={index}
                                    className={`${arrayElementClasses}
                                        ${currentIndex === index ? currentElementClass : ''}
                                        ${(phase === 'candidate_selection' && currentIndex > index) || (phase === 'verification' && currentIndex > index) || phase === 'done' ? processedElementClass : defaultElementClass}
                                        ${(phase === 'done' && result.includes(String(element)) && result.includes("Majority Element")) ? 'bg-teal-500 text-teal-50' : ''}
                                    `}
                                >
                                    {element}
                                </div>
                            ))}
                        </div>

                        {/* State Displays - Now inside the ref-attached div */}
                        {phase !== 'input' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                                <div className={candidateDisplayClasses}>
                                    Candidate: {candidate !== null ? candidate : 'N/A'}
                                </div>
                                <div className={countDisplayClasses}>
                                    Count: {count}
                                </div>
                                {(phase === 'verification' || phase === 'done') && (
                                     <div className={`${countDisplayClasses} col-span-full sm:col-span-2 bg-yellow-700 text-yellow-50`}>
                                        Verification Count: {verificationCount}
                                    </div>
                                )}
                                <div className="col-span-full sm:col-span-2 text-xl sm:text-2xl text-gray-300 font-mono">
                                    Phase: <span className="font-semibold text-white">{phase.replace('_', ' ').toUpperCase()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Result Display - Has its own ref and celebration effect */}
                {result && (
                    <p ref={resultRef} className={resultDisplayClasses}>
                        {result}
                    </p>
                )}
            </div>
        </div>
    );
};

export default App;
