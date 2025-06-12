type ErrorContext = 'login' | 'logout' | 'register' | 'reset' | 'forgot' | 'message' | 'global';

export function handleErrors(error: any, context: ErrorContext) {
    const message = error?.response?.data?.message || error?.message;

    switch (context) {
        case 'login':
            if (message === 'Invalid credentials') {
                alert('Invalid email or password.');
            } else {
                alert(message || 'Login failed.');
            }
            break;

        case 'register':
            if (message === 'Email is already registered') {
                alert('An account with this email already exists.');
            } else {
                alert(message || 'Registration failed.');
            }
            break;

        case 'reset':
            if (message === 'Temporary password expired') {
                alert('Your temporary password has expired.');
            } else if (message === 'Temporary password is invalid') {
                alert('The temporary password is incorrect.');
            } else if (message === 'Reset not allowed') {
                alert('Reset not allowed. Please check your email or request again.');
            } else {
                alert(message || 'Password reset failed.');
            }
            break;

        case 'forgot':
            if (message === 'No user found for that email') {
                alert('No user found with that email.');
            } else {
                alert(message || 'Password reset email could not be sent.');
            }
            break;

        case 'message':
            alert(message || 'Failed to send message.');
            break;

        case 'logout':
            alert(message || 'Logout failed.');
            break;

        case 'global':
        default:
            alert(message || 'Something went wrong.');
    }

    console.error(`[${context.toUpperCase()} ERROR]:`, message);
}