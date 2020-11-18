import './App.css';
import $ from 'jquery';
import React, {useState} from "react";

export default function App() {

    const [stateValue, setStateValue] = useState();
    const [codeVerifierValue, setCodeVerifierValue] = useState();
    const [codeChallengeValue, setCodeChallengeValue] = useState();
    const [state, setState] = useState();
    const [authCode, setAuthCode] = useState();
    const [accessToken, setAccessToken] = useState();
    const [resourceData, setResourceData] = useState();


    const generateState = () => {
        let value = "";
        const alphaNumericCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

        for (let i = 0; i < alphaNumericCharacters.length; i++) {
            value += alphaNumericCharacters.charAt(Math.floor(Math.random() * alphaNumericCharacters.length))
        }

        setStateValue(value);
    }

    const generateCodeVerifier = () => {
        let returnValue, randomByteArray = new Uint8Array(32);
        window.crypto.getRandomValues(randomByteArray);
        returnValue = base64UrlEncode(randomByteArray);

        setCodeVerifierValue(returnValue);
    }

    async function generateCodeChallenge() {
        const codeVerifier = codeVerifierValue;
        const textEncoder = new TextEncoder("US-ASCII");
        const encoderValue = textEncoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest("SHA-256", encoderValue);

        setCodeChallengeValue(base64UrlEncode(Array.from(new Uint8Array(digest))));
    }

    const base64UrlEncode = sourceValue => {
        const stringValue = String.fromCharCode.apply(null, sourceValue);
        const base64Encoded = btoa(stringValue);

        return base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    }

    const getPKCEEnhancedAuthCode = () => {
        const state = stateValue
        const codeChallenge = codeChallengeValue;

        let authorizationUrl = "http://localhost:8080/auth/realms/poc/protocol/openid-connect/auth";
        authorizationUrl += "?client_id=poc-app";
        authorizationUrl += "&response_type=code";
        authorizationUrl += "&scope=openid";
        authorizationUrl += "&redirect_uri=http://localhost:3000/auth-code-reader";
        authorizationUrl += "&state=" + state;
        authorizationUrl += "&code_challenge=" + codeChallenge;
        authorizationUrl += "&code_challenge_method=S256";

        console.log(authorizationUrl);
        window.open(authorizationUrl, "authorizationRequestWindow", 'width=800, height=600, left-200, top=200');
    }

    window.postAuthorize = function (state, authCode) {
        if (stateValue !== state) {
            alert("State value has been tampered with. Flow continuation declined.")
            return;
        }

        setState(state);
        setAuthCode(authCode);
    }


    const requestAccessToken = () => {
        const data = {
            "grant_type": "authorization_code",
            "client_id": "poc-app",
            "code": authCode,
            "code_verifier": codeVerifierValue,
            "redirect_uri": "http://localhost:3000/auth-code-reader"
        };

        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
            },
            type: "POST",
            url: "http://localhost:8080/auth/realms/poc/protocol/openid-connect/token",
            data: data,
            success: postRequestAccessToken,
            data_type: "json"
        });
    }

    const postRequestAccessToken = data => {
        setAccessToken(data["access_token"]);
    }

    const getDataFromResourceService = () => {
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                request.setRequestHeader("Authorization", "Bearer " + accessToken)
            },
            type: "GET",
            url: "http://localhost:8762/api/resource-service-one/resource/status/check",
            success: postDataFromResourceService,
            data_type: "json"
        })
    }

    const postDataFromResourceService = data => {
        setResourceData(data);
    }

    return (
        <div className="container">
            <h1>OAuth2 Authorization Code Grant PoC (PKCE Enhanced)</h1>

            <div className="section">
                <p>
                    <label><strong>State value: </strong></label>
                    <span id="stateValue">{stateValue}</span>
                </p>
                <input type="button" value="Generate state value" onClick={generateState}/>
            </div>

            <div className="section">
                <p>
                    <label><strong>Code verifier value: </strong></label>
                    <span id="codeVerifierValue">{codeVerifierValue}</span>
                </p>
                <input type="button" value="Generate code verifier value" onClick={generateCodeVerifier}/>
            </div>

            <div className="section">
                <p>
                    <label><strong>Code challenge value: </strong></label>
                    <span id="codeChallengeValue">{codeChallengeValue}</span>
                </p>
                <input type="button" value="Generate code challenge value" onClick={generateCodeChallenge}/>
            </div>

            <div className="section">
                <p>
                    <label><strong>State: </strong></label>
                    <span id="state">{state}</span>
                </p>

                <p>
                    <label><strong>Auth Code: </strong></label>
                    <span id="authCode">{authCode}</span>
                </p>
                <input type="button" value="Generate PKCE Enhanced Auth Code" onClick={getPKCEEnhancedAuthCode}/>
            </div>

            <div className="section">
                <p>
                    <label><strong>JWT Access Token: </strong></label>
                    <span id="accessToken">{accessToken}</span>
                </p>
                <input type="button" value="Retrieve Access Token" onClick={requestAccessToken}/>
            </div>

            <div className="section">
                <p>
                    <label><strong>Resource Response Data: </strong></label>
                    <span id="resourceData">{resourceData}</span>
                </p>
                <input type="button" value="Get Data from Resource Service" onClick={getDataFromResourceService}/>
            </div>
        </div>
    );
}