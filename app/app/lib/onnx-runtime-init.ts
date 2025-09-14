/**
 * ONNX Runtime initialization script that runs before any model loading
 * This must be imported early in the application lifecycle
 */

// Run immediately when this module is loaded
if (typeof window !== 'undefined') {
    // Suppress ONNX Runtime warnings by overriding console methods
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    const originalConsoleLog = console.log;

    console.warn = function(...args: any[]) {
        const message = args.join(' ');
        
        // Filter out ONNX Runtime execution provider warnings
        if (
            message.includes('Some nodes were not assigned to the preferred execution providers') ||
            message.includes('ORT explicitly assigns shape related ops to CPU') ||
            message.includes('Rerunning with verbose output on a non-minimal build') ||
            message.includes('onnxruntime:') ||
            message.includes('session_state.cc:') ||
            message.includes('VerifyEachNodeIsAssignedToAnEp')
        ) {
            return;
        }
        
        originalConsoleWarn.apply(console, args);
    };

    console.error = function(...args: any[]) {
        const message = args.join(' ');
        
        // Filter out ONNX Runtime execution provider errors that are actually warnings
        if (
            message.includes('Some nodes were not assigned to the preferred execution providers') ||
            message.includes('ORT explicitly assigns shape related ops to CPU') ||
            message.includes('onnxruntime:') ||
            message.includes('session_state.cc:')
        ) {
            return;
        }
        
        originalConsoleError.apply(console, args);
    };

    // Also filter console.log for ONNX Runtime messages
    console.log = function(...args: any[]) {
        const message = args.join(' ');
        
        // Filter out ONNX Runtime messages
        if (
            message.includes('onnxruntime:') ||
            message.includes('ORT_LOG_LEVEL') ||
            message.includes('execution providers')
        ) {
            return;
        }
        
        originalConsoleLog.apply(console, args);
    };

    // Set environment variables if available
    if (typeof process !== 'undefined' && process.env) {
        process.env.ORT_LOG_LEVEL = '3'; // ERROR level only
        process.env.ORT_LOG_SEVERITY_LEVEL = '3';
    }

    console.log('ONNX Runtime warning suppression initialized');
}
