"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const plan = searchParams.get("plan") || "standard"

  const [subscriptionComplete, setSubscriptionComplete] = useState(false)

  const [bankingDetails, setBankingDetails] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    cardholderName: "",
    agreeToTerms: false,
  })

  const [depositDetails, setDepositDetails] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    cardholderName: "",
    agreeToTerms: false,
  })

  // Handle subscription payment
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()

    if (!bankingDetails.agreeToTerms) {
      alert("You must agree to the Terms & Policies to proceed.")
      return
    }

    setSubscriptionComplete(true)

    // Copy subscription details to depositDetails
    setDepositDetails({
      cardNumber: bankingDetails.cardNumber,
      expirationDate: bankingDetails.expirationDate,
      cvv: bankingDetails.cvv,
      cardholderName: bankingDetails.cardholderName,
      agreeToTerms: false,
    })
  }

  // Handle registration fee
  const handlePayDeposit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!depositDetails.agreeToTerms) {
      alert("You must agree to the Terms & Policies to pay the registration fee.")
      return
    }

    // Get registration data from sessionStorage
    const registrationData = sessionStorage.getItem("registrationData")
    if (registrationData) {
      try {
        const data = JSON.parse(registrationData)
        const learner = data.learner

        if (learner && learner.first_name && learner.last_name) {
          // Save full name for confirmation page
          sessionStorage.setItem(
            "learnerName",
            `${learner.first_name} ${learner.last_name}`
          )
        } else {
          // Fallback if learner object is missing
          sessionStorage.setItem("learnerName", depositDetails.cardholderName)
        }
      } catch (error) {
        console.error("Failed to parse registrationData:", error)
        // fallback to cardholder name
        sessionStorage.setItem("learnerName", depositDetails.cardholderName)
      }
    } else {
      // fallback if no registrationData found
      sessionStorage.setItem("learnerName", depositDetails.cardholderName)
    }

    router.push("/confirmation")
  }

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-12 text-center text-4xl font-bold">Payment Details</h1>

          <div className="grid gap-8 md:grid-cols-2">
            {/* SUBSCRIPTION PAYMENT */}
            <Card className="border-2 p-8">
              <h2 className="mb-6 text-3xl font-bold">SUBSCRIPTION PAYMENT</h2>

              <form onSubmit={handleSubscribe} className="space-y-6">
                <div>
                  <Label>Card Number</Label>
                  <Input
                    value={bankingDetails.cardNumber}
                    onChange={(e) =>
                      setBankingDetails({ ...bankingDetails, cardNumber: e.target.value })
                    }
                    required
                    disabled={subscriptionComplete}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expiration Date</Label>
                    <Input
                      placeholder="MM/YY"
                      value={bankingDetails.expirationDate}
                      onChange={(e) =>
                        setBankingDetails({ ...bankingDetails, expirationDate: e.target.value })
                      }
                      required
                      disabled={subscriptionComplete}
                    />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input
                      value={bankingDetails.cvv}
                      onChange={(e) =>
                        setBankingDetails({ ...bankingDetails, cvv: e.target.value })
                      }
                      required
                      disabled={subscriptionComplete}
                    />
                  </div>
                </div>

                <div>
                  <Label>Cardholder Name</Label>
                  <Input
                    value={bankingDetails.cardholderName}
                    onChange={(e) =>
                      setBankingDetails({ ...bankingDetails, cardholderName: e.target.value })
                    }
                    required
                    disabled={subscriptionComplete}
                  />
                </div>

                {/* TERMS CHECKBOX */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="subscription-terms"
                    checked={bankingDetails.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setBankingDetails({ ...bankingDetails, agreeToTerms: checked === true })
                    }
                    disabled={subscriptionComplete}
                  />
                  <Label htmlFor="subscription-terms" className="text-sm leading-relaxed">
                    I have read and agree to the{" "}
                    <a href="/terms" target="_blank" className="underline text-green-700 hover:text-green-800">
                      Terms & Conditions
                    </a>
                    ,{" "}
                    <a href="/privacy-policy" target="_blank" className="underline text-green-700 hover:text-green-800">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="/refund-policy" target="_blank" className="underline text-green-700 hover:text-green-800">
                      Refund / Cancellation Policy
                    </a>.
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!bankingDetails.agreeToTerms || subscriptionComplete}
                >
                  Subscribe
                </Button>
              </form>
            </Card>

            {/* REGISTRATION FEE */}
            <Card className="border-2 p-8">
              <h2 className="mb-6 text-3xl font-bold">REGISTRATION FEE</h2>

              <form onSubmit={handlePayDeposit} className="space-y-6">
                <div>
                  <Label>Card Number</Label>
                  <Input value={depositDetails.cardNumber} disabled />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Expiration Date</Label>
                    <Input value={depositDetails.expirationDate} disabled />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input value={depositDetails.cvv} disabled />
                  </div>
                </div>

                <div>
                  <Label>Cardholder Name</Label>
                  <Input value={depositDetails.cardholderName} disabled />
                </div>

                {/* DEPOSIT TERMS CHECKBOX */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="deposit-terms"
                    checked={depositDetails.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setDepositDetails({ ...depositDetails, agreeToTerms: checked === true })
                    }
                    disabled={!subscriptionComplete}
                  />
                  <Label htmlFor="deposit-terms" className="text-sm leading-relaxed">
                    I have read and agree to the{" "}
                    <a href="/terms" className="underline text-green-700">Terms & Conditions</a>,{" "}
                    <a href="/privacy-policy" className="underline text-green-700">Privacy Policy</a> and{" "}
                    <a href="/refund-policy" className="underline text-green-700">Refund / Cancellation Policy</a>.
                  </Label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!subscriptionComplete || !depositDetails.agreeToTerms}
                >
                  Pay Registration Fee
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
