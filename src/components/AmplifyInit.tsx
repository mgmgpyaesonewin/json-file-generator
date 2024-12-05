'use client';

import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs, {
    ssr: true,
});

const AmplifyInit = () => {
    return null;
};

export default AmplifyInit;