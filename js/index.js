const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.intentHandler = `LaunchRequest`;

        const speakOutput = 'Hi, Do you want to measure stroke risk or hypertension health?';

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//This intent will Calculate CHAD score
const StrokeRiskIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'StrokeRiskIntent');
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.intentHandler = `StrokeRiskIntentHandler`;

        let speakOutput = '';


        if (Alexa.getIntentName(handlerInput.requestEnvelope) === 'StrokeRiskIntent') {
            speakOutput = 'What is your age?';

            sessionAttributes.score = 0;
            sessionAttributes.nextIntent = 'AgeIntent';
        } else if (sessionAttributes.nextIntent === 'AgeIntent') {
            let age = sessionAttributes.number;

            speakOutput = 'Are you female?';

            if (age < 65) {
                sessionAttributes.score += 0;
            } else if (age >= 65 && age < 75) {
                sessionAttributes.score += 1;
            } else if (age >= 75) {
                sessionAttributes.score += 2;
            }

            sessionAttributes.nextIntent = 'genderFemale';
        } else if (sessionAttributes.nextIntent === 'genderFemale') {
            if (sessionAttributes.yesNoIntent === 'AMAZON.YesIntent') {
                sessionAttributes.score += 1;
            }

            speakOutput = `Do you have a history of hypertension?`;

            sessionAttributes.nextIntent = 'hyperTensionHistory';
        } else if (sessionAttributes.nextIntent === 'hyperTensionHistory') {
            if (sessionAttributes.yesNoIntent === 'AMAZON.YesIntent') {
                sessionAttributes.score += 1;
            }

            speakOutput = `Do you have a history of Stroke, TIA or Thromboembolism?`;

            sessionAttributes.nextIntent = 'strokeTiaThromboembolismHistory';
        } else if (sessionAttributes.nextIntent === 'strokeTiaThromboembolismHistory') {
            if (sessionAttributes.yesNoIntent === 'AMAZON.YesIntent') {
                sessionAttributes.score += 2;
            }

            speakOutput = `Do you have a history of vascular disease?`;

            sessionAttributes.nextIntent = 'vascularDiseaseHistory';
        } else if (sessionAttributes.nextIntent === 'vascularDiseaseHistory') {
            if (sessionAttributes.yesNoIntent === 'AMAZON.YesIntent') {
                sessionAttributes.score += 1;
            }

            speakOutput = `Do you have a history of diabetes?`;

            sessionAttributes.nextIntent = 'diabetesHistory';
        } else if (sessionAttributes.nextIntent === 'diabetesHistory') {
            let score = sessionAttributes.score;

            if (sessionAttributes.yesNoIntent === 'AMAZON.YesIntent') {
                score += 1;
            }

            let risk = null;

            if (score <= 1) {
                risk = 'LOW';
            } else if (score > 1 && score <= 3) {
                risk = 'MEDIUM';
            } else if (score > 3) {
                risk = 'HIGH';
            }

            speakOutput = `Thank you for your response. Your CHAD score is ${score}. Your stroke risk is ${risk}.`;

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//This intent will Calculate Hypertension risk
const HypertensionRiskIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'HypertensionRiskIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'SystolicBloodPressureIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'DiastolicBloodPressureIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'HeartRateIntent');
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.intentHandler = `HypertensionRiskIntentHandler`;

        let speakOutput = '';

        if (Alexa.getIntentName(handlerInput.requestEnvelope) === 'HypertensionRiskIntent') {
            speakOutput = 'Do you have a current BP reading?';

            sessionAttributes.nextIntent = 'currentBPReading';
        } else if (sessionAttributes.nextIntent === 'currentBPReading') {
            speakOutput = `What is your Systolic Blood Pressure (it is the top value on your BP reading)?`;

            sessionAttributes.nextIntent = 'SystolicBloodPressureIntent';
        } else if (sessionAttributes.nextIntent === 'SystolicBloodPressureIntent') {
            let sbp = sessionAttributes.number;

            speakOutput = `What is your Diastolic Blood Pressure (it is the bottom value on your BP reading)?`;

            sessionAttributes.sbp = sbp;
            sessionAttributes.nextIntent = 'DiastolicBloodPressureIntent';
        } else if (sessionAttributes.nextIntent === 'DiastolicBloodPressureIntent') {
            let dbp = sessionAttributes.number;

            speakOutput = `What is your Heart Rate?`;

            sessionAttributes.dbp = dbp;
            sessionAttributes.nextIntent = 'HeartRateIntent';
        } else if (sessionAttributes.nextIntent === 'HeartRateIntent') {
            let hr = sessionAttributes.number;

            speakOutput = `Do you have a headache?`;

            sessionAttributes.hr = hr;
            sessionAttributes.symptomsCounter = 0;
            sessionAttributes.nextIntent = 'headacheIntent';
        } else if (sessionAttributes.nextIntent === 'headacheIntent') {
            if (sessionAttributes.yesNoIntent === 'AMAZON.YesIntent') {
                sessionAttributes.symptomsCounter += 1;
            }

            speakOutput = `Do you have dizziness?`;

            sessionAttributes.nextIntent = 'dizzinessIntent';
        } else if (sessionAttributes.nextIntent === 'dizzinessIntent') {
            if (sessionAttributes.yesNoIntent === 'AMAZON.YesIntent') {
                sessionAttributes.symptomsCounter += 1;
            }

            speakOutput = `Do you have chest pain?`;

            sessionAttributes.nextIntent = 'chestPainIntent';
        } else if (sessionAttributes.nextIntent === 'chestPainIntent') {
            if (sessionAttributes.yesNoIntent === 'AMAZON.YesIntent') {
                sessionAttributes.symptomsCounter += 1;
            }

            speakOutput = `Do you have blurred vision?`;

            sessionAttributes.nextIntent = 'blurredVisionIntent';
        } else if (sessionAttributes.nextIntent === 'blurredVisionIntent') {
            if (sessionAttributes.yesNoIntent === 'AMAZON.YesIntent') {
                sessionAttributes.symptomsCounter += 1;
            }

            speakOutput = `Do you feel thirsty?`;

            sessionAttributes.nextIntent = 'thirstyIntent';
        } else if (sessionAttributes.nextIntent === 'thirstyIntent') {
            if (sessionAttributes.yesNoIntent === 'AMAZON.YesIntent') {
                sessionAttributes.symptomsCounter += 1;
            }

            let symptomsCounter = sessionAttributes.symptomsCounter;
            let sbp = sessionAttributes.sbp;
            let dbp = sessionAttributes.dbp;

            if (symptomsCounter > 0) {
                speakOutput = `You have symptoms commonly associated with hypertension. Please consult a physician`;
            } else if (sbp >= 110 && sbp <= 119 && dbp >= 70 && dbp <= 79) {
                speakOutput = `Your blood pressure readings are NORMAL`;
            } else if (sbp >= 120 && sbp <= 129 && dbp >= 70 && dbp <= 79) {
                speakOutput = `You have LOW risk of HYPERTENSION. Please consult a physician`;
            } else if (sbp >= 180 || dbp >= 120) {
                speakOutput = `You have risk of HYPERTENSIVE CRISIS. Please consult a physician immediately`;
            } else if (sbp >= 140 && sbp <= 179 || dbp >= 90 && dbp <= 119) {
                speakOutput = `You have HIGH risk of HYPERTENSION. Please consult a physician immediately`;
            } else if (sbp >= 130 && sbp <= 139 || dbp >= 80 && dbp <= 89) {
                speakOutput = `You have MEDIUM risk of HYPERTENSION. Please consult a physician`;
            } else if (sbp < 110 || dbp < 70) {
                speakOutput = `You may have HYPOTENSION. Please consult a physician`;
            }

            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const YesNoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent');
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.yesNoIntent = Alexa.getIntentName(handlerInput.requestEnvelope).toString();

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        handlerInput.responseBuilder
            .getResponse();

        if (sessionAttributes.intentHandler === "LaunchRequest") {
            if(sessionAttributes.yesNoIntent === 'AMAZON.YesIntent') {
                let speakOutput = `Please tell me what do you want to measure: Stroke risk or Hypertension Health?`;

                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput)
                    .getResponse();
            }

            return CancelAndStopIntentHandler.handle(handlerInput);
        } else if (sessionAttributes.intentHandler === "StrokeRiskIntentHandler") {
            return StrokeRiskIntentHandler.handle(handlerInput);
        } else if (sessionAttributes.intentHandler === "HypertensionRiskIntentHandler") {
            if (sessionAttributes.nextIntent === 'currentBPReading' && sessionAttributes.yesNoIntent === 'AMAZON.NoIntent') {
                speakOutput = `Please take a reading. Once completed, start the app again by saying, Alexa, open Nurse Chad`;

                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
            }

            return HypertensionRiskIntentHandler.handle(handlerInput);
        }
    }
};

const NumberIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NumberIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.number = Alexa.getSlotValue(handlerInput.requestEnvelope, 'number');

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        handlerInput.responseBuilder
            .getResponse();

        if (sessionAttributes.intentHandler === "StrokeRiskIntentHandler") {
            return StrokeRiskIntentHandler.handle(handlerInput);
        } else if (sessionAttributes.intentHandler === "HypertensionRiskIntentHandler") {
            return HypertensionRiskIntentHandler.handle(handlerInput);
        }
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hi, Nurse CHAD helps you measure stroke risk or hypertension health. So, please tell me what do you want to measure: Stroke risk or Hypertension Health?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        StrokeRiskIntentHandler,
        HypertensionRiskIntentHandler,
        YesNoIntentHandler,
        NumberIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();