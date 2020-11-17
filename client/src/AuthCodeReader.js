import './App.css';
import React from "react";

export default function AuthCodeReader() {
    const queryStringParameters = new URLSearchParams(window.location.search);
    const authCode = queryStringParameters.get("code"),
        state = queryStringParameters.get("state"),
        error = queryStringParameters.get("error"),
        errorDescription = queryStringParameters.get("error_description");

    if (error) {
        return (
            <div className="container">
                <h1>Auth Code Reader</h1>
                <div className="section">
                    <p>
                        <label><strong>Error: </strong></label>
                        <span id="error">{error}</span>
                    </p>
                    <p>
                        <label><strong>Error description: </strong></label>
                        <span id="error">{errorDescription}</span>
                    </p>
                </div>
            </div>
        );
    } else {
        window.opener.postAuthorize(state, authCode);
        window.close();

        return (
            <div className="container">
                <h1>Auth Code Reader</h1>
                <p>Checking... performing post authorize process</p>
            </div>
        );
    }
}
