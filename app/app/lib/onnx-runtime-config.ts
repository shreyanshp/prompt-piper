/**
 * ONNX Runtime configuration utility to suppress warnings and optimize performance
 */

// Global flag to track if ONNX Runtime has been configured
let onnxConfigured = false;

/**
 * Configure ONNX Runtime to suppress warnings and optimize for browser usage
 */
export function configureONNXRuntime(): void {
    if (typeof window === 'undefined' || onnxConfigured) {
        return;
    }

    try {
        // Suppress ONNX Runtime warnings by overriding console methods
        const originalConsoleWarn = console.warn;
        const originalConsoleError = console.error;

        console.warn = function(...args: any[]) {
            const message = args.join(' ');
            
            // Filter out ONNX Runtime execution provider warnings
            if (
                message.includes('Some nodes were not assigned to the preferred execution providers') ||
                message.includes('ORT explicitly assigns shape related ops to CPU') ||
                message.includes('Rerunning with verbose output on a non-minimal build') ||
                message.includes('onnxruntime:') ||
                message.includes('session_state.cc:')
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
                message.includes('onnxruntime:')
            ) {
                return;
            }
            
            originalConsoleError.apply(console, args);
        };

        // Set global ONNX Runtime environment variables if available
        if (typeof process !== 'undefined' && process.env) {
            process.env.ORT_LOG_LEVEL = '3'; // ERROR level only
        }

        onnxConfigured = true;
        console.log('ONNX Runtime configured to suppress warnings');
    } catch (error) {
        console.warn('Failed to configure ONNX Runtime:', error);
    }
}

/**
 * Get ONNX Runtime configuration for Transformers.js
 */
export function getONNXConfig() {
    return {
        logLevel: 'error' as const,
        executionProviders: ['wasm'] as const,
        // Additional ONNX Runtime options
        graphOptimizationLevel: 'all' as const,
        enableCpuMemArena: false,
        enableMemPattern: false,
        enableMemReuse: true,
        // Disable verbose logging
        logSeverityLevel: 3, // ERROR level only
        logVerbosityLevel: 0,
    };
}

/**
 * Get optimized Transformers.js configuration
 */
export function getOptimizedTransformersConfig() {
    return {
        device: 'auto' as const,
        dtype: 'fp32' as const,
        backend: 'wasm' as const,
        onnx: getONNXConfig(),
        // Additional optimizations
        useBrowserCache: true,
        useCustomCache: false,
        // Disable progress logging
        progress: false,
    };
}
