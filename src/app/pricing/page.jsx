// src/app/pricing/page.js
"use client";

import PricingComparison from "@/components/pricing/PricingComparison";
import Container from "@/components/shared/Container";
import React, { useState } from "react";

export default function PricingPage() {
    // Simulating user premium state tracking hook context
    const [isPremium, setIsPremium] = useState(false);

    const handleStripeCheckoutRedirect = async () => {
        try {
            console.log("Redirecting user to Stripe Checkout pipeline via /api/v1/create-checkout-session...");
            // Wrap your actual fetch/redirect execution logic layers here
        } catch (err) {
            console.error("Stripe initialization processing error:", err);
        }
    };

    return (
        <div className="py-20 md:py-24 transition-colors duration-300">
            <Container>

                <PricingComparison
                    onUpgradeClick={handleStripeCheckoutRedirect}
                    isPremiumUser={isPremium}
                    className="mb-16"
                />

                {/* Safety Bottom FAQ Block Notice */}
                <div className="max-w-2xl mx-auto text-center px-4 text-xs text-muted leading-relaxed">
                    Secure billing systems handled directly through automated Stripe platforms. Need processing help? Contact operations via our modern help channels.
                </div>
            </Container>
        </div>
    );
}