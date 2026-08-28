import { getDriver } from "../../config/database.js";

/*
 * ContextGraph Seed
 *
 * Synthetic but realistic support-intelligence dataset.
 *
 * The dataset is intentionally interconnected to demonstrate:
 *
 * Customer
 *   -> Ticket
 *   -> Product
 *   -> Component
 *   -> Vendor
 *
 * Customer
 *   -> Ticket
 *   -> Bug
 *   -> Team
 *   -> Person
 *
 * Customer
 *   -> Ticket
 *   -> Bug
 *   -> Resolution
 *   -> Document
 *
 * Customer
 *   -> Incident
 *   -> Component
 *   -> Vendor
 *
 * Customer
 *   -> Incident
 *   -> Person
 *
 * Existing important IDs are preserved:
 *
 * customer-acme
 * customer-nova
 * ticket-1042
 * ticket-1071
 * bug-221
 * bug-247
 * resolution-87
 * resolution-91
 *
 * All data is synthetic and intended for demonstration/testing.
 */

/* -------------------------------------------------------------------------- */
/* Customers                                                                  */
/* -------------------------------------------------------------------------- */

const customers = [
  {
    id: "customer-acme",
    name: "Acme Corporation",
    industry: "FinTech",
    tier: "Enterprise",
    region: "North America",
  },
  {
    id: "customer-nova",
    name: "Nova Retail",
    industry: "Retail",
    tier: "Enterprise",
    region: "Europe",
  },
  {
    id: "customer-orbit",
    name: "Orbit Commerce",
    industry: "E-Commerce",
    tier: "Growth",
    region: "Asia Pacific",
  },
  {
    id: "customer-pinnacle",
    name: "Pinnacle Finance",
    industry: "Financial Services",
    tier: "Enterprise",
    region: "North America",
  },
  {
    id: "customer-greenfield",
    name: "Greenfield Markets",
    industry: "Retail",
    tier: "Growth",
    region: "Europe",
  },
  {
    id: "customer-vertex",
    name: "Vertex Labs",
    industry: "Technology",
    tier: "Enterprise",
    region: "North America",
  },
  {
    id: "customer-summit",
    name: "Summit Travel",
    industry: "Travel",
    tier: "Growth",
    region: "Asia Pacific",
  },
  {
    id: "customer-bluewave",
    name: "BlueWave Logistics",
    industry: "Logistics",
    tier: "Enterprise",
    region: "North America",
  },
  {
    id: "customer-atlas",
    name: "Atlas Health",
    industry: "Healthcare",
    tier: "Enterprise",
    region: "North America",
  },
  {
    id: "customer-cedar",
    name: "Cedar Bank",
    industry: "Banking",
    tier: "Enterprise",
    region: "Europe",
  },
  {
    id: "customer-northstar",
    name: "Northstar Media",
    industry: "Media",
    tier: "Growth",
    region: "North America",
  },
  {
    id: "customer-brightcart",
    name: "BrightCart",
    industry: "E-Commerce",
    tier: "Growth",
    region: "Asia Pacific",
  },
  {
    id: "customer-meridian",
    name: "Meridian Insurance",
    industry: "Insurance",
    tier: "Enterprise",
    region: "Europe",
  },
  {
    id: "customer-apex",
    name: "Apex Mobility",
    industry: "Transportation",
    tier: "Growth",
    region: "North America",
  },
  {
    id: "customer-harbor",
    name: "Harbor Foods",
    industry: "Food & Beverage",
    tier: "Growth",
    region: "North America",
  },
  {
    id: "customer-quantum",
    name: "Quantum Systems",
    industry: "Technology",
    tier: "Enterprise",
    region: "Europe",
  },
  {
    id: "customer-evergreen",
    name: "Evergreen Hotels",
    industry: "Hospitality",
    tier: "Enterprise",
    region: "Asia Pacific",
  },
  {
    id: "customer-metropay",
    name: "MetroPay",
    industry: "FinTech",
    tier: "Enterprise",
    region: "North America",
  },
  {
    id: "customer-silverline",
    name: "Silverline Telecom",
    industry: "Telecommunications",
    tier: "Enterprise",
    region: "Europe",
  },
  {
    id: "customer-redwood",
    name: "Redwood Commerce",
    industry: "E-Commerce",
    tier: "Growth",
    region: "North America",
  },
];

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

const products = [
  {
    id: "product-payment-api",
    name: "Payment API",
    category: "Payments",
    status: "active",
  },
  {
    id: "product-checkout",
    name: "Checkout Platform",
    category: "Commerce",
    status: "active",
  },
  {
    id: "product-subscriptions",
    name: "Subscriptions",
    category: "Billing",
    status: "active",
  },
  {
    id: "product-payouts",
    name: "Payouts API",
    category: "Payments",
    status: "active",
  },
  {
    id: "product-identity",
    name: "Identity Service",
    category: "Security",
    status: "active",
  },
  {
    id: "product-invoicing",
    name: "Invoicing Platform",
    category: "Billing",
    status: "active",
  },
  {
    id: "product-notifications",
    name: "Notification Service",
    category: "Communication",
    status: "active",
  },
  {
    id: "product-risk",
    name: "Risk Engine",
    category: "Security",
    status: "active",
  },
];

/* -------------------------------------------------------------------------- */
/* Features                                                                   */
/* -------------------------------------------------------------------------- */

const features = [
  {
    id: "feature-payment-processing",
    name: "Payment Processing",
    description: "Processes card and wallet payments",
  },
  {
    id: "feature-webhooks",
    name: "Payment Webhooks",
    description: "Delivers payment lifecycle events",
  },
  {
    id: "feature-checkout",
    name: "Checkout",
    description: "Provides checkout session functionality",
  },
  {
    id: "feature-retry",
    name: "Payment Retry",
    description: "Retries transient payment failures",
  },
  {
    id: "feature-subscription-renewal",
    name: "Subscription Renewal",
    description: "Automatically renews customer subscriptions",
  },
  {
    id: "feature-payouts",
    name: "Merchant Payouts",
    description: "Processes merchant payout requests",
  },
  {
    id: "feature-authentication",
    name: "Authentication",
    description: "Provides identity and authentication services",
  },
  {
    id: "feature-risk-checks",
    name: "Risk Checks",
    description: "Evaluates payment risk signals",
  },
  {
    id: "feature-invoice-generation",
    name: "Invoice Generation",
    description: "Generates customer invoices",
  },
  {
    id: "feature-invoice-delivery",
    name: "Invoice Delivery",
    description: "Delivers invoices through configured channels",
  },
  {
    id: "feature-email-notifications",
    name: "Email Notifications",
    description: "Sends transactional email notifications",
  },
  {
    id: "feature-sms-notifications",
    name: "SMS Notifications",
    description: "Sends transactional SMS notifications",
  },
  {
    id: "feature-fraud-detection",
    name: "Fraud Detection",
    description: "Detects suspicious transaction patterns",
  },
  {
    id: "feature-device-trust",
    name: "Device Trust",
    description: "Evaluates trusted customer devices",
  },
  {
    id: "feature-wallet-payments",
    name: "Wallet Payments",
    description: "Supports digital wallet payment methods",
  },
  {
    id: "feature-refunds",
    name: "Refund Processing",
    description: "Processes customer refund requests",
  },
];

/* -------------------------------------------------------------------------- */
/* Teams                                                                      */
/* -------------------------------------------------------------------------- */

const teams = [
  {
    id: "team-payments",
    name: "Payments Platform",
    function: "Engineering",
  },
  {
    id: "team-checkout",
    name: "Checkout Engineering",
    function: "Engineering",
  },
  {
    id: "team-billing",
    name: "Billing Platform",
    function: "Engineering",
  },
  {
    id: "team-identity",
    name: "Identity Engineering",
    function: "Engineering",
  },
  {
    id: "team-support",
    name: "Customer Support",
    function: "Support",
  },
  {
    id: "team-platform",
    name: "Platform Reliability",
    function: "Infrastructure",
  },
  {
    id: "team-risk",
    name: "Risk Engineering",
    function: "Security",
  },
  {
    id: "team-notifications",
    name: "Notifications Engineering",
    function: "Engineering",
  },
];

/* -------------------------------------------------------------------------- */
/* People                                                                     */
/* -------------------------------------------------------------------------- */

const people = [
  {
    id: "person-rahul",
    name: "Rahul Sharma",
    role: "Senior Backend Engineer",
  },
  {
    id: "person-ananya",
    name: "Ananya Reddy",
    role: "Payments Engineer",
  },
  {
    id: "person-priya",
    name: "Priya Nair",
    role: "Support Engineer",
  },
  {
    id: "person-arjun",
    name: "Arjun Mehta",
    role: "Staff Engineer",
  },
  {
    id: "person-neha",
    name: "Neha Kapoor",
    role: "Billing Engineer",
  },
  {
    id: "person-rohan",
    name: "Rohan Verma",
    role: "Platform Engineer",
  },
  {
    id: "person-sneha",
    name: "Sneha Iyer",
    role: "Identity Engineer",
  },
  {
    id: "person-vikram",
    name: "Vikram Rao",
    role: "Site Reliability Engineer",
  },
  {
    id: "person-meera",
    name: "Meera Joshi",
    role: "Customer Support Specialist",
  },
  {
    id: "person-karthik",
    name: "Karthik Menon",
    role: "Payments Engineer",
  },
  {
    id: "person-divya",
    name: "Divya Shah",
    role: "Billing Engineer",
  },
  {
    id: "person-aditya",
    name: "Aditya Rao",
    role: "Platform Engineer",
  },
  {
    id: "person-kavya",
    name: "Kavya Menon",
    role: "Identity Engineer",
  },
  {
    id: "person-sanjay",
    name: "Sanjay Gupta",
    role: "Risk Engineer",
  },
  {
    id: "person-isha",
    name: "Isha Verma",
    role: "Support Engineer",
  },
  {
    id: "person-nikhil",
    name: "Nikhil Jain",
    role: "Notifications Engineer",
  },
  {
    id: "person-pooja",
    name: "Pooja Rao",
    role: "Senior SRE",
  },
  {
    id: "person-varun",
    name: "Varun Mehta",
    role: "Backend Engineer",
  },
  {
    id: "person-rhea",
    name: "Rhea Kapoor",
    role: "Technical Support Engineer",
  },
  {
    id: "person-mohan",
    name: "Mohan Iyer",
    role: "Staff Platform Engineer",
  },
];

/* -------------------------------------------------------------------------- */
/* Bugs                                                                       */
/* -------------------------------------------------------------------------- */

const bugs = [
  {
    id: "bug-221",
    title: "Payment API returning intermittent 500 errors",
    severity: "critical",
    status: "resolved",
  },
  {
    id: "bug-247",
    title: "Checkout session timeout",
    severity: "high",
    status: "investigating",
  },
  {
    id: "bug-258",
    title: "Duplicate webhook delivery",
    severity: "medium",
    status: "resolved",
  },
  {
    id: "bug-263",
    title: "Subscription renewal failure",
    severity: "high",
    status: "resolved",
  },
  {
    id: "bug-271",
    title: "Payout processing delayed",
    severity: "high",
    status: "investigating",
  },
  {
    id: "bug-284",
    title: "Authentication token expiration",
    severity: "medium",
    status: "resolved",
  },
  {
    id: "bug-292",
    title: "Checkout tax calculation mismatch",
    severity: "medium",
    status: "investigating",
  },
  {
    id: "bug-301",
    title: "Payment retry loop under gateway failure",
    severity: "high",
    status: "resolved",
  },
  {
    id: "bug-315",
    title: "Payout reconciliation mismatch",
    severity: "medium",
    status: "investigating",
  },
  {
    id: "bug-327",
    title: "Risk check latency spike",
    severity: "high",
    status: "resolved",
  },
  {
    id: "bug-334",
    title: "Invoice generation delayed",
    severity: "medium",
    status: "investigating",
  },
  {
    id: "bug-341",
    title: "Invoice email delivery failure",
    severity: "high",
    status: "resolved",
  },
  {
    id: "bug-348",
    title: "SMS notification queue backlog",
    severity: "medium",
    status: "investigating",
  },
  {
    id: "bug-355",
    title: "Fraud scoring timeout",
    severity: "high",
    status: "resolved",
  },
  {
    id: "bug-362",
    title: "Device trust verification failure",
    severity: "medium",
    status: "resolved",
  },
  {
    id: "bug-369",
    title: "Wallet payment authorization failure",
    severity: "high",
    status: "investigating",
  },
  {
    id: "bug-376",
    title: "Refund processing stuck",
    severity: "high",
    status: "resolved",
  },
  {
    id: "bug-383",
    title: "Payment webhook signature mismatch",
    severity: "medium",
    status: "investigating",
  },
  {
    id: "bug-390",
    title: "Checkout API latency spike",
    severity: "high",
    status: "resolved",
  },
  {
    id: "bug-397",
    title: "Subscription invoice mismatch",
    severity: "medium",
    status: "investigating",
  },
  {
    id: "bug-404",
    title: "Payout status webhook delayed",
    severity: "medium",
    status: "resolved",
  },
  {
    id: "bug-411",
    title: "Authentication service elevated latency",
    severity: "high",
    status: "resolved",
  },
  {
    id: "bug-418",
    title: "Risk rule configuration not applied",
    severity: "medium",
    status: "investigating",
  },
  {
    id: "bug-425",
    title: "Notification retry exhaustion",
    severity: "medium",
    status: "resolved",
  },
  {
    id: "bug-432",
    title: "Invoice tax rounding discrepancy",
    severity: "low",
    status: "investigating",
  },
];

/* -------------------------------------------------------------------------- */
/* Resolutions                                                                */
/* -------------------------------------------------------------------------- */

const resolutions = [
  {
    id: "resolution-87",
    title: "Increase payment gateway timeout and retry policy",
    status: "verified",
  },
  {
    id: "resolution-91",
    title: "Increase checkout session TTL",
    status: "verified",
  },
  {
    id: "resolution-96",
    title: "Add webhook idempotency protection",
    status: "verified",
  },
  {
    id: "resolution-103",
    title: "Retry failed subscription renewal requests",
    status: "verified",
  },
  {
    id: "resolution-109",
    title: "Increase payout processing worker capacity",
    status: "verified",
  },
  {
    id: "resolution-116",
    title: "Refresh authentication token before expiration",
    status: "verified",
  },
  {
    id: "resolution-124",
    title: "Correct checkout tax calculation configuration",
    status: "verified",
  },
  {
    id: "resolution-131",
    title: "Apply bounded retry strategy for gateway failures",
    status: "verified",
  },
  {
    id: "resolution-138",
    title: "Reconcile payout ledger using settlement reference",
    status: "verified",
  },
  {
    id: "resolution-145",
    title: "Optimize risk-check dependency timeout",
    status: "verified",
  },
  {
    id: "resolution-152",
    title: "Scale invoice generation workers",
    status: "verified",
  },
  {
    id: "resolution-159",
    title: "Repair invoice email provider retry handling",
    status: "verified",
  },
  {
    id: "resolution-166",
    title: "Increase notification queue consumer capacity",
    status: "verified",
  },
  {
    id: "resolution-173",
    title: "Cache fraud provider responses within safe limits",
    status: "verified",
  },
  {
    id: "resolution-180",
    title: "Refresh device trust credentials",
    status: "verified",
  },
  {
    id: "resolution-187",
    title: "Retry wallet authorization with gateway fallback",
    status: "verified",
  },
  {
    id: "resolution-194",
    title: "Restart stuck refund workflow and reconcile state",
    status: "verified",
  },
  {
    id: "resolution-201",
    title: "Rotate webhook signing configuration",
    status: "verified",
  },
  {
    id: "resolution-208",
    title: "Optimize checkout dependency timeout",
    status: "verified",
  },
  {
    id: "resolution-215",
    title: "Synchronize subscription invoice calculation",
    status: "verified",
  },
  {
    id: "resolution-222",
    title: "Increase payout webhook worker capacity",
    status: "verified",
  },
  {
    id: "resolution-229",
    title: "Scale authentication service replicas",
    status: "verified",
  },
  {
    id: "resolution-236",
    title: "Reload risk rule configuration",
    status: "verified",
  },
  {
    id: "resolution-243",
    title: "Increase notification retry budget",
    status: "verified",
  },
  {
    id: "resolution-250",
    title: "Normalize invoice tax rounding rules",
    status: "verified",
  },
];

/* -------------------------------------------------------------------------- */
/* Documents                                                                  */
/* -------------------------------------------------------------------------- */

const documents = [
  {
    id: "document-payment-runbook",
    title: "Payment Incident Runbook",
    type: "runbook",
  },
  {
    id: "document-checkout-runbook",
    title: "Checkout Troubleshooting Runbook",
    type: "runbook",
  },
  {
    id: "document-webhook-guide",
    title: "Webhook Reliability Guide",
    type: "guide",
  },
  {
    id: "document-billing-runbook",
    title: "Billing Renewal Runbook",
    type: "runbook",
  },
  {
    id: "document-payout-runbook",
    title: "Payout Operations Runbook",
    type: "runbook",
  },
  {
    id: "document-identity-runbook",
    title: "Identity Authentication Runbook",
    type: "runbook",
  },
  {
    id: "document-tax-guide",
    title: "Checkout Tax Configuration Guide",
    type: "guide",
  },
  {
    id: "document-retry-guide",
    title: "Payment Retry Policy",
    type: "guide",
  },
  {
    id: "document-reconciliation-guide",
    title: "Payout Reconciliation Guide",
    type: "guide",
  },
  {
    id: "document-risk-runbook",
    title: "Payment Risk Incident Runbook",
    type: "runbook",
  },
  {
    id: "document-invoice-runbook",
    title: "Invoice Generation Runbook",
    type: "runbook",
  },
  {
    id: "document-email-guide",
    title: "Transactional Email Delivery Guide",
    type: "guide",
  },
  {
    id: "document-sms-runbook",
    title: "SMS Notification Operations Runbook",
    type: "runbook",
  },
  {
    id: "document-fraud-guide",
    title: "Fraud Detection Operations Guide",
    type: "guide",
  },
  {
    id: "document-device-trust-guide",
    title: "Device Trust Troubleshooting Guide",
    type: "guide",
  },
  {
    id: "document-wallet-runbook",
    title: "Wallet Payment Runbook",
    type: "runbook",
  },
  {
    id: "document-refund-runbook",
    title: "Refund Processing Runbook",
    type: "runbook",
  },
  {
    id: "document-webhook-security",
    title: "Webhook Security Guide",
    type: "guide",
  },
  {
    id: "document-checkout-performance",
    title: "Checkout Performance Guide",
    type: "guide",
  },
  {
    id: "document-subscription-billing",
    title: "Subscription Billing Guide",
    type: "guide",
  },
  {
    id: "document-payout-webhooks",
    title: "Payout Webhook Operations Guide",
    type: "guide",
  },
  {
    id: "document-auth-performance",
    title: "Authentication Performance Runbook",
    type: "runbook",
  },
  {
    id: "document-risk-config",
    title: "Risk Rule Configuration Guide",
    type: "guide",
  },
  {
    id: "document-notification-retry",
    title: "Notification Retry Guide",
    type: "guide",
  },
  {
    id: "document-invoice-tax",
    title: "Invoice Tax Calculation Guide",
    type: "guide",
  },
];

/* -------------------------------------------------------------------------- */
/* Incidents                                                                  */
/* -------------------------------------------------------------------------- */

const incidents = [
  {
    id: "incident-payment-500",
    title: "Payment API 500 Incident",
    status: "resolved",
  },
  {
    id: "incident-checkout-timeout",
    title: "Checkout Timeout Incident",
    status: "investigating",
  },
  {
    id: "incident-webhook-duplication",
    title: "Webhook Duplication Incident",
    status: "resolved",
  },
  {
    id: "incident-billing-renewal",
    title: "Subscription Renewal Incident",
    status: "resolved",
  },
  {
    id: "incident-payout-delay",
    title: "Payout Processing Delay",
    status: "investigating",
  },
  {
    id: "incident-identity-session",
    title: "Identity Session Incident",
    status: "resolved",
  },
  {
    id: "incident-tax-calculation",
    title: "Checkout Tax Calculation Incident",
    status: "investigating",
  },
  {
    id: "incident-gateway-retry",
    title: "Gateway Retry Incident",
    status: "resolved",
  },
  {
    id: "incident-reconciliation",
    title: "Payout Reconciliation Incident",
    status: "investigating",
  },
  {
    id: "incident-risk-latency",
    title: "Risk Check Latency Incident",
    status: "resolved",
  },
  {
    id: "incident-invoice-generation",
    title: "Invoice Generation Incident",
    status: "investigating",
  },
  {
    id: "incident-email-delivery",
    title: "Invoice Email Delivery Incident",
    status: "resolved",
  },
  {
    id: "incident-sms-backlog",
    title: "SMS Notification Backlog",
    status: "investigating",
  },
  {
    id: "incident-fraud-timeout",
    title: "Fraud Scoring Timeout Incident",
    status: "resolved",
  },
  {
    id: "incident-device-trust",
    title: "Device Trust Verification Incident",
    status: "resolved",
  },
  {
    id: "incident-wallet-payment",
    title: "Wallet Authorization Incident",
    status: "investigating",
  },
  {
    id: "incident-refund-stuck",
    title: "Refund Workflow Incident",
    status: "resolved",
  },
  {
    id: "incident-checkout-latency",
    title: "Checkout Latency Incident",
    status: "resolved",
  },
  {
    id: "incident-auth-latency",
    title: "Authentication Latency Incident",
    status: "resolved",
  },
  {
    id: "incident-notification-retry",
    title: "Notification Retry Incident",
    status: "resolved",
  },
];

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

const components = [
  {
    id: "component-payment-gateway",
    name: "Payment Gateway",
    type: "service",
  },
  {
    id: "component-checkout-service",
    name: "Checkout Service",
    type: "service",
  },
  {
    id: "component-webhook-service",
    name: "Webhook Service",
    type: "service",
  },
  {
    id: "component-billing-worker",
    name: "Billing Worker",
    type: "worker",
  },
  {
    id: "component-payout-worker",
    name: "Payout Worker",
    type: "worker",
  },
  {
    id: "component-identity-service",
    name: "Identity Service",
    type: "service",
  },
  {
    id: "component-tax-service",
    name: "Tax Service",
    type: "service",
  },
  {
    id: "component-risk-service",
    name: "Risk Service",
    type: "service",
  },
  {
    id: "component-ledger-service",
    name: "Ledger Service",
    type: "service",
  },
  {
    id: "component-invoice-service",
    name: "Invoice Service",
    type: "service",
  },
  {
    id: "component-email-worker",
    name: "Email Worker",
    type: "worker",
  },
  {
    id: "component-sms-worker",
    name: "SMS Worker",
    type: "worker",
  },
  {
    id: "component-fraud-service",
    name: "Fraud Service",
    type: "service",
  },
  {
    id: "component-device-service",
    name: "Device Trust Service",
    type: "service",
  },
  {
    id: "component-refund-worker",
    name: "Refund Worker",
    type: "worker",
  },
];

/* -------------------------------------------------------------------------- */
/* Vendors                                                                    */
/* -------------------------------------------------------------------------- */

const vendors = [
  {
    id: "vendor-stripe",
    name: "Stripe",
    type: "payment-provider",
  },
  {
    id: "vendor-adyen",
    name: "Adyen",
    type: "payment-provider",
  },
  {
    id: "vendor-okta",
    name: "Okta",
    type: "identity-provider",
  },
  {
    id: "vendor-taxjar",
    name: "TaxJar",
    type: "tax-provider",
  },
  {
    id: "vendor-riskified",
    name: "Riskified",
    type: "risk-provider",
  },
  {
    id: "vendor-sendgrid",
    name: "SendGrid",
    type: "email-provider",
  },
  {
    id: "vendor-twilio",
    name: "Twilio",
    type: "sms-provider",
  },
  {
    id: "vendor-cloudflare",
    name: "Cloudflare",
    type: "infrastructure-provider",
  },
];

/* -------------------------------------------------------------------------- */
/* Environments                                                               */
/* -------------------------------------------------------------------------- */

const environments = [
  {
    id: "environment-production",
    name: "Production",
    type: "environment",
  },
  {
    id: "environment-staging",
    name: "Staging",
    type: "environment",
  },
  {
    id: "environment-development",
    name: "Development",
    type: "environment",
  },
];

/* -------------------------------------------------------------------------- */
/* Tickets                                                                    */
/* -------------------------------------------------------------------------- */

const tickets = [
  {
    id: "ticket-1042",
    title: "Acme payment requests returning 500",
    status: "open",
    priority: "urgent",
    createdAt: "2026-08-20T09:30:00Z",
    customerId: "customer-acme",
    productId: "product-payment-api",
    bugId: "bug-221",
  },
  {
    id: "ticket-1071",
    title: "Checkout sessions expire unexpectedly",
    status: "investigating",
    priority: "high",
    createdAt: "2026-08-22T11:45:00Z",
    customerId: "customer-nova",
    productId: "product-checkout",
    bugId: "bug-247",
  },
  {
    id: "ticket-1083",
    title: "Duplicate payment webhooks received",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-08-18T14:20:00Z",
    customerId: "customer-acme",
    productId: "product-payment-api",
    bugId: "bug-258",
  },
  {
    id: "ticket-1092",
    title: "Subscription renewal failed overnight",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-17T07:10:00Z",
    customerId: "customer-orbit",
    productId: "product-subscriptions",
    bugId: "bug-263",
  },
  {
    id: "ticket-1104",
    title: "Merchant payout has not arrived",
    status: "investigating",
    priority: "high",
    createdAt: "2026-08-21T12:15:00Z",
    customerId: "customer-pinnacle",
    productId: "product-payouts",
    bugId: "bug-271",
  },
  {
    id: "ticket-1118",
    title: "Users are being logged out unexpectedly",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-08-16T18:30:00Z",
    customerId: "customer-greenfield",
    productId: "product-identity",
    bugId: "bug-284",
  },
  {
    id: "ticket-1127",
    title: "Checkout total differs from expected tax",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-23T10:00:00Z",
    customerId: "customer-vertex",
    productId: "product-checkout",
    bugId: "bug-292",
  },
  {
    id: "ticket-1135",
    title: "Payments retry repeatedly during gateway outage",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-15T15:45:00Z",
    customerId: "customer-summit",
    productId: "product-payment-api",
    bugId: "bug-301",
  },
  {
    id: "ticket-1144",
    title: "Payout reconciliation does not match settlement",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-24T09:10:00Z",
    customerId: "customer-bluewave",
    productId: "product-payouts",
    bugId: "bug-315",
  },
  {
    id: "ticket-1151",
    title: "Risk checks are increasing payment latency",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-19T16:25:00Z",
    customerId: "customer-vertex",
    productId: "product-payment-api",
    bugId: "bug-327",
  },
  {
    id: "ticket-1162",
    title: "Checkout payment failed after retry",
    status: "open",
    priority: "high",
    createdAt: "2026-08-25T08:40:00Z",
    customerId: "customer-nova",
    productId: "product-payment-api",
    bugId: "bug-301",
  },
  {
    id: "ticket-1174",
    title: "Subscription renewal webhook delayed",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-08-25T13:30:00Z",
    customerId: "customer-orbit",
    productId: "product-subscriptions",
    bugId: "bug-258",
  },
  {
    id: "ticket-1181",
    title: "Invoices are taking too long to generate",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-18T10:20:00Z",
    customerId: "customer-atlas",
    productId: "product-invoicing",
    bugId: "bug-334",
  },
  {
    id: "ticket-1189",
    title: "Customers did not receive invoice emails",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-19T12:10:00Z",
    customerId: "customer-cedar",
    productId: "product-invoicing",
    bugId: "bug-341",
  },
  {
    id: "ticket-1197",
    title: "SMS notifications remain queued",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-21T15:30:00Z",
    customerId: "customer-northstar",
    productId: "product-notifications",
    bugId: "bug-348",
  },
  {
    id: "ticket-1205",
    title: "Fraud checks are timing out",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-17T13:40:00Z",
    customerId: "customer-brightcart",
    productId: "product-risk",
    bugId: "bug-355",
  },
  {
    id: "ticket-1213",
    title: "Device verification fails for returning users",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-08-20T17:15:00Z",
    customerId: "customer-meridian",
    productId: "product-identity",
    bugId: "bug-362",
  },
  {
    id: "ticket-1221",
    title: "Wallet payments fail intermittently",
    status: "investigating",
    priority: "high",
    createdAt: "2026-08-23T08:25:00Z",
    customerId: "customer-apex",
    productId: "product-payment-api",
    bugId: "bug-369",
  },
  {
    id: "ticket-1229",
    title: "Refund remains in processing state",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-16T09:45:00Z",
    customerId: "customer-harbor",
    productId: "product-payment-api",
    bugId: "bug-376",
  },
  {
    id: "ticket-1237",
    title: "Webhook signatures are rejected",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-24T14:05:00Z",
    customerId: "customer-quantum",
    productId: "product-payment-api",
    bugId: "bug-383",
  },
  {
    id: "ticket-1245",
    title: "Checkout API response times increased",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-15T11:20:00Z",
    customerId: "customer-evergreen",
    productId: "product-checkout",
    bugId: "bug-390",
  },
  {
    id: "ticket-1253",
    title: "Subscription invoice amount is incorrect",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-22T16:30:00Z",
    customerId: "customer-metropay",
    productId: "product-subscriptions",
    bugId: "bug-397",
  },
  {
    id: "ticket-1261",
    title: "Payout status webhook is delayed",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-08-18T08:15:00Z",
    customerId: "customer-silverline",
    productId: "product-payouts",
    bugId: "bug-404",
  },
  {
    id: "ticket-1269",
    title: "Login requests are unusually slow",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-19T10:45:00Z",
    customerId: "customer-redwood",
    productId: "product-identity",
    bugId: "bug-411",
  },
  {
    id: "ticket-1277",
    title: "Risk rule update is not taking effect",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-24T11:30:00Z",
    customerId: "customer-acme",
    productId: "product-risk",
    bugId: "bug-418",
  },
  {
    id: "ticket-1285",
    title: "Notification retries are exhausted",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-08-20T13:15:00Z",
    customerId: "customer-nova",
    productId: "product-notifications",
    bugId: "bug-425",
  },
  {
    id: "ticket-1293",
    title: "Invoice tax rounding differs by one cent",
    status: "investigating",
    priority: "low",
    createdAt: "2026-08-25T09:25:00Z",
    customerId: "customer-orbit",
    productId: "product-invoicing",
    bugId: "bug-432",
  },
  {
    id: "ticket-1301",
    title: "Payment gateway returned intermittent 502 responses",
    status: "open",
    priority: "urgent",
    createdAt: "2026-08-26T07:50:00Z",
    customerId: "customer-pinnacle",
    productId: "product-payment-api",
    bugId: "bug-221",
  },
  {
    id: "ticket-1309",
    title: "Checkout session expired during peak traffic",
    status: "investigating",
    priority: "high",
    createdAt: "2026-08-26T10:40:00Z",
    customerId: "customer-greenfield",
    productId: "product-checkout",
    bugId: "bug-247",
  },
  {
    id: "ticket-1317",
    title: "Duplicate webhook events after retry",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-08-26T12:20:00Z",
    customerId: "customer-vertex",
    productId: "product-payment-api",
    bugId: "bug-258",
  },
  {
    id: "ticket-1325",
    title: "Subscription renewal did not complete",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-26T14:15:00Z",
    customerId: "customer-summit",
    productId: "product-subscriptions",
    bugId: "bug-263",
  },
  {
    id: "ticket-1333",
    title: "Payout processing exceeded expected SLA",
    status: "investigating",
    priority: "high",
    createdAt: "2026-08-26T15:45:00Z",
    customerId: "customer-bluewave",
    productId: "product-payouts",
    bugId: "bug-271",
  },
  {
    id: "ticket-1341",
    title: "Authentication token expired during checkout",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-08-27T08:05:00Z",
    customerId: "customer-atlas",
    productId: "product-identity",
    bugId: "bug-284",
  },
  {
    id: "ticket-1349",
    title: "Checkout tax total is incorrect",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-27T09:30:00Z",
    customerId: "customer-cedar",
    productId: "product-checkout",
    bugId: "bug-292",
  },
  {
    id: "ticket-1357",
    title: "Payment retries caused duplicate attempts",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-27T10:10:00Z",
    customerId: "customer-northstar",
    productId: "product-payment-api",
    bugId: "bug-301",
  },
  {
    id: "ticket-1365",
    title: "Settlement reconciliation is out of balance",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-27T11:25:00Z",
    customerId: "customer-brightcart",
    productId: "product-payouts",
    bugId: "bug-315",
  },
  {
    id: "ticket-1373",
    title: "Fraud service latency affects payment flow",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-27T12:40:00Z",
    customerId: "customer-meridian",
    productId: "product-risk",
    bugId: "bug-327",
  },
  {
    id: "ticket-1381",
    title: "Invoice batch processing is delayed",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-27T13:05:00Z",
    customerId: "customer-apex",
    productId: "product-invoicing",
    bugId: "bug-334",
  },
  {
    id: "ticket-1389",
    title: "Invoice delivery failed for enterprise accounts",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-27T13:50:00Z",
    customerId: "customer-harbor",
    productId: "product-invoicing",
    bugId: "bug-341",
  },
  {
    id: "ticket-1397",
    title: "SMS delivery backlog is increasing",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-27T14:30:00Z",
    customerId: "customer-quantum",
    productId: "product-notifications",
    bugId: "bug-348",
  },
  {
    id: "ticket-1405",
    title: "Fraud provider timeout during authorization",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-27T15:15:00Z",
    customerId: "customer-evergreen",
    productId: "product-risk",
    bugId: "bug-355",
  },
  {
    id: "ticket-1413",
    title: "Device verification challenge fails",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-08-27T16:05:00Z",
    customerId: "customer-metropay",
    productId: "product-identity",
    bugId: "bug-362",
  },
  {
    id: "ticket-1421",
    title: "Apple Pay authorization is intermittently rejected",
    status: "investigating",
    priority: "high",
    createdAt: "2026-08-28T07:30:00Z",
    customerId: "customer-silverline",
    productId: "product-payment-api",
    bugId: "bug-369",
  },
  {
    id: "ticket-1429",
    title: "Refund processing has been pending for several hours",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-28T08:10:00Z",
    customerId: "customer-redwood",
    productId: "product-payment-api",
    bugId: "bug-376",
  },
  {
    id: "ticket-1437",
    title: "Webhook signature verification failed",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-28T08:55:00Z",
    customerId: "customer-acme",
    productId: "product-payment-api",
    bugId: "bug-383",
  },
  {
    id: "ticket-1445",
    title: "Checkout requests are slower than normal",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-28T09:35:00Z",
    customerId: "customer-nova",
    productId: "product-checkout",
    bugId: "bug-390",
  },
  {
    id: "ticket-1453",
    title: "Subscription invoice amount changed unexpectedly",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-28T10:05:00Z",
    customerId: "customer-orbit",
    productId: "product-subscriptions",
    bugId: "bug-397",
  },
  {
    id: "ticket-1461",
    title: "Payout status callback delayed",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-08-28T10:40:00Z",
    customerId: "customer-pinnacle",
    productId: "product-payouts",
    bugId: "bug-404",
  },
  {
    id: "ticket-1469",
    title: "Authentication latency increased during morning traffic",
    status: "resolved",
    priority: "high",
    createdAt: "2026-08-28T11:15:00Z",
    customerId: "customer-greenfield",
    productId: "product-identity",
    bugId: "bug-411",
  },
  {
    id: "ticket-1477",
    title: "Risk configuration update is not visible",
    status: "investigating",
    priority: "medium",
    createdAt: "2026-08-28T11:50:00Z",
    customerId: "customer-vertex",
    productId: "product-risk",
    bugId: "bug-418",
  },
  {
    id: "ticket-1485",
    title: "Notification retry queue reached maximum attempts",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-08-28T12:25:00Z",
    customerId: "customer-summit",
    productId: "product-notifications",
    bugId: "bug-425",
  },
  {
    id: "ticket-1493",
    title: "Invoice tax differs from checkout total",
    status: "investigating",
    priority: "low",
    createdAt: "2026-08-28T13:00:00Z",
    customerId: "customer-bluewave",
    productId: "product-invoicing",
    bugId: "bug-432",
  },
];

/* -------------------------------------------------------------------------- */
/* Product -> Feature                                                         */
/* -------------------------------------------------------------------------- */

const productFeatures = [
  {
    productId: "product-payment-api",
    featureId: "feature-payment-processing",
  },
  {
    productId: "product-payment-api",
    featureId: "feature-webhooks",
  },
  {
    productId: "product-payment-api",
    featureId: "feature-retry",
  },
  {
    productId: "product-payment-api",
    featureId: "feature-wallet-payments",
  },
  {
    productId: "product-payment-api",
    featureId: "feature-refunds",
  },
  {
    productId: "product-checkout",
    featureId: "feature-checkout",
  },
  {
    productId: "product-checkout",
    featureId: "feature-payment-processing",
  },
  {
    productId: "product-checkout",
    featureId: "feature-wallet-payments",
  },
  {
    productId: "product-subscriptions",
    featureId: "feature-subscription-renewal",
  },
  {
    productId: "product-subscriptions",
    featureId: "feature-invoice-generation",
  },
  {
    productId: "product-payouts",
    featureId: "feature-payouts",
  },
  {
    productId: "product-identity",
    featureId: "feature-authentication",
  },
  {
    productId: "product-identity",
    featureId: "feature-device-trust",
  },
  {
    productId: "product-invoicing",
    featureId: "feature-invoice-generation",
  },
  {
    productId: "product-invoicing",
    featureId: "feature-invoice-delivery",
  },
  {
    productId: "product-notifications",
    featureId: "feature-email-notifications",
  },
  {
    productId: "product-notifications",
    featureId: "feature-sms-notifications",
  },
  {
    productId: "product-risk",
    featureId: "feature-risk-checks",
  },
  {
    productId: "product-risk",
    featureId: "feature-fraud-detection",
  },
];

/* -------------------------------------------------------------------------- */
/* Bug -> Product                                                             */
/* -------------------------------------------------------------------------- */

const bugProducts = [
  "product-payment-api",
  "product-checkout",
  "product-payment-api",
  "product-subscriptions",
  "product-payouts",
  "product-identity",
  "product-checkout",
  "product-payment-api",
  "product-payouts",
  "product-risk",
  "product-invoicing",
  "product-invoicing",
  "product-notifications",
  "product-risk",
  "product-identity",
  "product-payment-api",
  "product-payment-api",
  "product-payment-api",
  "product-checkout",
  "product-subscriptions",
  "product-payouts",
  "product-identity",
  "product-risk",
  "product-notifications",
  "product-invoicing",
].map((productId, index) => ({
  bugId: bugs[index].id,
  productId,
}));

/* -------------------------------------------------------------------------- */
/* Bug -> Team                                                                */
/* -------------------------------------------------------------------------- */

const bugTeamIds = [
  "team-payments",
  "team-checkout",
  "team-payments",
  "team-billing",
  "team-platform",
  "team-identity",
  "team-checkout",
  "team-payments",
  "team-platform",
  "team-risk",
  "team-billing",
  "team-billing",
  "team-notifications",
  "team-risk",
  "team-identity",
  "team-payments",
  "team-payments",
  "team-payments",
  "team-checkout",
  "team-billing",
  "team-platform",
  "team-identity",
  "team-risk",
  "team-notifications",
  "team-billing",
];

const bugTeams = bugs.map((bug, index) => ({
  bugId: bug.id,
  teamId: bugTeamIds[index],
}));

/* -------------------------------------------------------------------------- */
/* Team -> Person                                                             */
/* -------------------------------------------------------------------------- */

const teamMembers = [
  {
    teamId: "team-payments",
    personId: "person-rahul",
  },
  {
    teamId: "team-payments",
    personId: "person-ananya",
  },
  {
    teamId: "team-payments",
    personId: "person-karthik",
  },
  {
    teamId: "team-payments",
    personId: "person-varun",
  },
  {
    teamId: "team-checkout",
    personId: "person-arjun",
  },
  {
    teamId: "team-checkout",
    personId: "person-priya",
  },
  {
    teamId: "team-checkout",
    personId: "person-rhea",
  },
  {
    teamId: "team-billing",
    personId: "person-neha",
  },
  {
    teamId: "team-billing",
    personId: "person-divya",
  },
  {
    teamId: "team-billing",
    personId: "person-priya",
  },
  {
    teamId: "team-identity",
    personId: "person-sneha",
  },
  {
    teamId: "team-identity",
    personId: "person-kavya",
  },
  {
    teamId: "team-support",
    personId: "person-meera",
  },
  {
    teamId: "team-support",
    personId: "person-isha",
  },
  {
    teamId: "team-platform",
    personId: "person-rohan",
  },
  {
    teamId: "team-platform",
    personId: "person-vikram",
  },
  {
    teamId: "team-platform",
    personId: "person-aditya",
  },
  {
    teamId: "team-platform",
    personId: "person-mohan",
  },
  {
    teamId: "team-risk",
    personId: "person-sanjay",
  },
  {
    teamId: "team-risk",
    personId: "person-karthik",
  },
  {
    teamId: "team-notifications",
    personId: "person-nikhil",
  },
  {
    teamId: "team-notifications",
    personId: "person-pooja",
  },
  {
    teamId: "team-support",
    personId: "person-rhea",
  },
];

/* -------------------------------------------------------------------------- */
/* Bug -> Resolution                                                          */
/* -------------------------------------------------------------------------- */

const bugResolutions = bugs.map((bug, index) => ({
  bugId: bug.id,
  resolutionId: resolutions[index].id,
}));

/* -------------------------------------------------------------------------- */
/* Resolution -> Document                                                     */
/* -------------------------------------------------------------------------- */

const resolutionDocuments = resolutions.map((resolution, index) => ({
  resolutionId: resolution.id,
  documentId: documents[index].id,
}));

/* -------------------------------------------------------------------------- */
/* Bug -> Incident                                                            */
/* -------------------------------------------------------------------------- */

const bugIncidents = bugs.slice(0, incidents.length).map((bug, index) => ({
  bugId: bug.id,
  incidentId: incidents[index].id,
}));

/* -------------------------------------------------------------------------- */
/* Customer -> Incident                                                       */
/* -------------------------------------------------------------------------- */

const customerIncidentPairs = [
  ["customer-acme", "incident-payment-500"],
  ["customer-nova", "incident-checkout-timeout"],
  ["customer-acme", "incident-webhook-duplication"],
  ["customer-orbit", "incident-billing-renewal"],
  ["customer-pinnacle", "incident-payout-delay"],
  ["customer-greenfield", "incident-identity-session"],
  ["customer-vertex", "incident-tax-calculation"],
  ["customer-summit", "incident-gateway-retry"],
  ["customer-bluewave", "incident-reconciliation"],
  ["customer-vertex", "incident-risk-latency"],
  ["customer-atlas", "incident-invoice-generation"],
  ["customer-cedar", "incident-email-delivery"],
  ["customer-northstar", "incident-sms-backlog"],
  ["customer-brightcart", "incident-fraud-timeout"],
  ["customer-meridian", "incident-device-trust"],
  ["customer-apex", "incident-wallet-payment"],
  ["customer-harbor", "incident-refund-stuck"],
  ["customer-evergreen", "incident-checkout-latency"],
  ["customer-redwood", "incident-auth-latency"],
  ["customer-summit", "incident-notification-retry"],
] as const;

const customerIncidents = customerIncidentPairs.map(
  ([customerId, incidentId]) => ({
    customerId,
    incidentId,
  }),
);

/* -------------------------------------------------------------------------- */
/* Incident -> Component                                                      */
/* -------------------------------------------------------------------------- */

const incidentComponentIds = [
  "component-payment-gateway",
  "component-checkout-service",
  "component-webhook-service",
  "component-billing-worker",
  "component-payout-worker",
  "component-identity-service",
  "component-tax-service",
  "component-payment-gateway",
  "component-ledger-service",
  "component-risk-service",
  "component-invoice-service",
  "component-email-worker",
  "component-sms-worker",
  "component-fraud-service",
  "component-device-service",
  "component-payment-gateway",
  "component-refund-worker",
  "component-checkout-service",
  "component-identity-service",
  "component-email-worker",
];

const incidentComponents = incidents.map((incident, index) => ({
  incidentId: incident.id,
  componentId: incidentComponentIds[index],
}));

/* -------------------------------------------------------------------------- */
/* Incident -> Product                                                        */
/* -------------------------------------------------------------------------- */

const incidentProductIds = [
  "product-payment-api",
  "product-checkout",
  "product-payment-api",
  "product-subscriptions",
  "product-payouts",
  "product-identity",
  "product-checkout",
  "product-payment-api",
  "product-payouts",
  "product-risk",
  "product-invoicing",
  "product-invoicing",
  "product-notifications",
  "product-risk",
  "product-identity",
  "product-payment-api",
  "product-payment-api",
  "product-checkout",
  "product-identity",
  "product-notifications",
];

const incidentProducts = incidents.map((incident, index) => ({
  incidentId: incident.id,
  productId: incidentProductIds[index],
}));

/* -------------------------------------------------------------------------- */
/* Incident -> Person                                                         */
/* -------------------------------------------------------------------------- */

const incidentResponderIds = [
  "person-rahul",
  "person-arjun",
  "person-karthik",
  "person-neha",
  "person-rohan",
  "person-sneha",
  "person-arjun",
  "person-ananya",
  "person-vikram",
  "person-sanjay",
  "person-divya",
  "person-nikhil",
  "person-pooja",
  "person-sanjay",
  "person-kavya",
  "person-karthik",
  "person-varun",
  "person-arjun",
  "person-vikram",
  "person-nikhil",
];

const incidentResponders = incidents.map((incident, index) => ({
  incidentId: incident.id,
  personId: incidentResponderIds[index],
}));

/* -------------------------------------------------------------------------- */
/* Component -> Vendor                                                        */
/* -------------------------------------------------------------------------- */

const componentVendors = [
  {
    componentId: "component-payment-gateway",
    vendorId: "vendor-stripe",
  },
  {
    componentId: "component-payment-gateway",
    vendorId: "vendor-adyen",
  },
  {
    componentId: "component-checkout-service",
    vendorId: "vendor-adyen",
  },
  {
    componentId: "component-webhook-service",
    vendorId: "vendor-stripe",
  },
  {
    componentId: "component-billing-worker",
    vendorId: "vendor-cloudflare",
  },
  {
    componentId: "component-payout-worker",
    vendorId: "vendor-stripe",
  },
  {
    componentId: "component-identity-service",
    vendorId: "vendor-okta",
  },
  {
    componentId: "component-tax-service",
    vendorId: "vendor-taxjar",
  },
  {
    componentId: "component-risk-service",
    vendorId: "vendor-riskified",
  },
  {
    componentId: "component-ledger-service",
    vendorId: "vendor-cloudflare",
  },
  {
    componentId: "component-invoice-service",
    vendorId: "vendor-cloudflare",
  },
  {
    componentId: "component-email-worker",
    vendorId: "vendor-sendgrid",
  },
  {
    componentId: "component-sms-worker",
    vendorId: "vendor-twilio",
  },
  {
    componentId: "component-fraud-service",
    vendorId: "vendor-riskified",
  },
  {
    componentId: "component-device-service",
    vendorId: "vendor-okta",
  },
];

/* -------------------------------------------------------------------------- */
/* Product -> Component                                                       */
/* -------------------------------------------------------------------------- */

const productComponents = [
  {
    productId: "product-payment-api",
    componentId: "component-payment-gateway",
  },
  {
    productId: "product-payment-api",
    componentId: "component-webhook-service",
  },
  {
    productId: "product-payment-api",
    componentId: "component-risk-service",
  },
  {
    productId: "product-payment-api",
    componentId: "component-refund-worker",
  },
  {
    productId: "product-checkout",
    componentId: "component-checkout-service",
  },
  {
    productId: "product-checkout",
    componentId: "component-tax-service",
  },
  {
    productId: "product-subscriptions",
    componentId: "component-billing-worker",
  },
  {
    productId: "product-subscriptions",
    componentId: "component-invoice-service",
  },
  {
    productId: "product-payouts",
    componentId: "component-payout-worker",
  },
  {
    productId: "product-payouts",
    componentId: "component-ledger-service",
  },
  {
    productId: "product-identity",
    componentId: "component-identity-service",
  },
  {
    productId: "product-identity",
    componentId: "component-device-service",
  },
  {
    productId: "product-invoicing",
    componentId: "component-invoice-service",
  },
  {
    productId: "product-invoicing",
    componentId: "component-email-worker",
  },
  {
    productId: "product-notifications",
    componentId: "component-email-worker",
  },
  {
    productId: "product-notifications",
    componentId: "component-sms-worker",
  },
  {
    productId: "product-risk",
    componentId: "component-risk-service",
  },
  {
    productId: "product-risk",
    componentId: "component-fraud-service",
  },
];

/* -------------------------------------------------------------------------- */
/* Product -> Environment                                                     */
/* -------------------------------------------------------------------------- */

const productEnvironments = [
  {
    productId: "product-payment-api",
    environmentId: "environment-production",
  },
  {
    productId: "product-payment-api",
    environmentId: "environment-staging",
  },
  {
    productId: "product-payment-api",
    environmentId: "environment-development",
  },
  {
    productId: "product-checkout",
    environmentId: "environment-production",
  },
  {
    productId: "product-checkout",
    environmentId: "environment-staging",
  },
  {
    productId: "product-subscriptions",
    environmentId: "environment-production",
  },
  {
    productId: "product-payouts",
    environmentId: "environment-production",
  },
  {
    productId: "product-identity",
    environmentId: "environment-production",
  },
  {
    productId: "product-identity",
    environmentId: "environment-staging",
  },
  {
    productId: "product-invoicing",
    environmentId: "environment-production",
  },
  {
    productId: "product-notifications",
    environmentId: "environment-production",
  },
  {
    productId: "product-risk",
    environmentId: "environment-production",
  },
];

/* -------------------------------------------------------------------------- */
/* Customer -> Product                                                        */
/* -------------------------------------------------------------------------- */

const customerProductPairs = [
  ["customer-acme", "product-payment-api"],
  ["customer-acme", "product-risk"],
  ["customer-nova", "product-checkout"],
  ["customer-nova", "product-payment-api"],
  ["customer-nova", "product-notifications"],
  ["customer-orbit", "product-subscriptions"],
  ["customer-orbit", "product-invoicing"],
  ["customer-pinnacle", "product-payouts"],
  ["customer-pinnacle", "product-payment-api"],
  ["customer-greenfield", "product-identity"],
  ["customer-greenfield", "product-checkout"],
  ["customer-vertex", "product-checkout"],
  ["customer-vertex", "product-payment-api"],
  ["customer-vertex", "product-risk"],
  ["customer-summit", "product-payment-api"],
  ["customer-summit", "product-subscriptions"],
  ["customer-summit", "product-notifications"],
  ["customer-bluewave", "product-payouts"],
  ["customer-bluewave", "product-invoicing"],
  ["customer-atlas", "product-invoicing"],
  ["customer-atlas", "product-identity"],
  ["customer-cedar", "product-invoicing"],
  ["customer-cedar", "product-payment-api"],
  ["customer-northstar", "product-notifications"],
  ["customer-northstar", "product-subscriptions"],
  ["customer-brightcart", "product-risk"],
  ["customer-brightcart", "product-payment-api"],
  ["customer-meridian", "product-identity"],
  ["customer-meridian", "product-risk"],
  ["customer-apex", "product-invoicing"],
  ["customer-apex", "product-payment-api"],
  ["customer-harbor", "product-payment-api"],
  ["customer-harbor", "product-invoicing"],
  ["customer-quantum", "product-payment-api"],
  ["customer-quantum", "product-notifications"],
  ["customer-evergreen", "product-checkout"],
  ["customer-evergreen", "product-risk"],
  ["customer-metropay", "product-subscriptions"],
  ["customer-metropay", "product-identity"],
  ["customer-silverline", "product-payouts"],
  ["customer-silverline", "product-payment-api"],
  ["customer-redwood", "product-checkout"],
  ["customer-redwood", "product-payment-api"],
] as const;

const customerProducts = customerProductPairs.map(
  ([customerId, productId]) => ({
    customerId,
    productId,
  }),
);

/* -------------------------------------------------------------------------- */
/* Seed step definition                                                       */
/* -------------------------------------------------------------------------- */

type SeedStep = {
  name: string;
  query: string;
  parameters: Record<string, unknown>;
};

const seedSteps: SeedStep[] = [
  /* ---------------------------------------------------------------------- */
  /* Nodes                                                                  */
  /* ---------------------------------------------------------------------- */

  {
    name: "customers",
    query: `
      UNWIND $rows AS row
      MERGE (n:Customer {id: row.id})
      SET n.name = row.name,
          n.industry = row.industry,
          n.tier = row.tier,
          n.region = row.region
    `,
    parameters: {
      rows: customers,
    },
  },

  {
    name: "products",
    query: `
      UNWIND $rows AS row
      MERGE (n:Product {id: row.id})
      SET n.name = row.name,
          n.category = row.category,
          n.status = row.status
    `,
    parameters: {
      rows: products,
    },
  },

  {
    name: "features",
    query: `
      UNWIND $rows AS row
      MERGE (n:Feature {id: row.id})
      SET n.name = row.name,
          n.description = row.description
    `,
    parameters: {
      rows: features,
    },
  },

  {
    name: "teams",
    query: `
      UNWIND $rows AS row
      MERGE (n:Team {id: row.id})
      SET n.name = row.name,
          n.function = row.function
    `,
    parameters: {
      rows: teams,
    },
  },

  {
    name: "people",
    query: `
      UNWIND $rows AS row
      MERGE (n:Person {id: row.id})
      SET n.name = row.name,
          n.role = row.role
    `,
    parameters: {
      rows: people,
    },
  },

  {
    name: "bugs",
    query: `
      UNWIND $rows AS row
      MERGE (n:Bug {id: row.id})
      SET n.title = row.title,
          n.severity = row.severity,
          n.status = row.status
    `,
    parameters: {
      rows: bugs,
    },
  },

  {
    name: "resolutions",
    query: `
      UNWIND $rows AS row
      MERGE (n:Resolution {id: row.id})
      SET n.title = row.title,
          n.status = row.status
    `,
    parameters: {
      rows: resolutions,
    },
  },

  {
    name: "documents",
    query: `
      UNWIND $rows AS row
      MERGE (n:Document {id: row.id})
      SET n.title = row.title,
          n.type = row.type
    `,
    parameters: {
      rows: documents,
    },
  },

  {
    name: "tickets",
    query: `
      UNWIND $rows AS row
      MERGE (n:Ticket {id: row.id})
      SET n.title = row.title,
          n.status = row.status,
          n.priority = row.priority,
          n.createdAt = row.createdAt
    `,
    parameters: {
      rows: tickets,
    },
  },

  {
    name: "incidents",
    query: `
      UNWIND $rows AS row
      MERGE (n:Incident {id: row.id})
      SET n.title = row.title,
          n.status = row.status
    `,
    parameters: {
      rows: incidents,
    },
  },

  {
    name: "components",
    query: `
      UNWIND $rows AS row
      MERGE (n:Component {id: row.id})
      SET n.name = row.name,
          n.type = row.type
    `,
    parameters: {
      rows: components,
    },
  },

  {
    name: "vendors",
    query: `
      UNWIND $rows AS row
      MERGE (n:Vendor {id: row.id})
      SET n.name = row.name,
          n.type = row.type
    `,
    parameters: {
      rows: vendors,
    },
  },

  {
    name: "environments",
    query: `
      UNWIND $rows AS row
      MERGE (n:Environment {id: row.id})
      SET n.name = row.name,
          n.type = row.type
    `,
    parameters: {
      rows: environments,
    },
  },

  /* ---------------------------------------------------------------------- */
  /* Customer relationships                                                  */
  /* ---------------------------------------------------------------------- */

  {
    name: "ticket-customer relationships",
    query: `
      UNWIND $rows AS row
      MATCH (customer:Customer {id: row.customerId})
      MATCH (ticket:Ticket {id: row.ticketId})
      MERGE (customer)-[:RAISED]->(ticket)
    `,
    parameters: {
      rows: tickets.map((ticket) => ({
        ticketId: ticket.id,
        customerId: ticket.customerId,
      })),
    },
  },

  {
    name: "customer-product relationships",
    query: `
      UNWIND $rows AS row
      MATCH (customer:Customer {id: row.customerId})
      MATCH (product:Product {id: row.productId})
      MERGE (customer)-[:USES_PRODUCT]->(product)
    `,
    parameters: {
      rows: customerProducts,
    },
  },

  /* ---------------------------------------------------------------------- */
  /* Ticket relationships                                                    */
  /* ---------------------------------------------------------------------- */

  {
    name: "ticket-product relationships",
    query: `
      UNWIND $rows AS row
      MATCH (ticket:Ticket {id: row.ticketId})
      MATCH (product:Product {id: row.productId})
      MERGE (ticket)-[:ABOUT]->(product)
    `,
    parameters: {
      rows: tickets.map((ticket) => ({
        ticketId: ticket.id,
        productId: ticket.productId,
      })),
    },
  },

  {
    name: "ticket-bug relationships",
    query: `
      UNWIND $rows AS row
      MATCH (ticket:Ticket {id: row.ticketId})
      MATCH (bug:Bug {id: row.bugId})
      MERGE (ticket)-[:RELATED_TO]->(bug)
    `,
    parameters: {
      rows: tickets.map((ticket) => ({
        ticketId: ticket.id,
        bugId: ticket.bugId,
      })),
    },
  },

  /* ---------------------------------------------------------------------- */
  /* Product relationships                                                   */
  /* ---------------------------------------------------------------------- */

  {
    name: "product-feature relationships",
    query: `
      UNWIND $rows AS row
      MATCH (product:Product {id: row.productId})
      MATCH (feature:Feature {id: row.featureId})
      MERGE (product)-[:HAS_FEATURE]->(feature)
    `,
    parameters: {
      rows: productFeatures,
    },
  },

  {
    name: "product-component relationships",
    query: `
      UNWIND $rows AS row
      MATCH (product:Product {id: row.productId})
      MATCH (component:Component {id: row.componentId})
      MERGE (product)-[:USES_COMPONENT]->(component)
    `,
    parameters: {
      rows: productComponents,
    },
  },

  {
    name: "product-environment relationships",
    query: `
      UNWIND $rows AS row
      MATCH (product:Product {id: row.productId})
      MATCH (environment:Environment {id: row.environmentId})
      MERGE (product)-[:DEPLOYED_IN]->(environment)
    `,
    parameters: {
      rows: productEnvironments,
    },
  },

  /* ---------------------------------------------------------------------- */
  /* Bug relationships                                                       */
  /* ---------------------------------------------------------------------- */

  {
    name: "bug-product relationships",
    query: `
      UNWIND $rows AS row
      MATCH (bug:Bug {id: row.bugId})
      MATCH (product:Product {id: row.productId})
      MERGE (bug)-[:AFFECTS]->(product)
    `,
    parameters: {
      rows: bugProducts,
    },
  },

  {
    name: "bug-team relationships",
    query: `
      UNWIND $rows AS row
      MATCH (bug:Bug {id: row.bugId})
      MATCH (team:Team {id: row.teamId})
      MERGE (bug)-[:OWNED_BY]->(team)
    `,
    parameters: {
      rows: bugTeams,
    },
  },

  {
    name: "team-member relationships",
    query: `
      UNWIND $rows AS row
      MATCH (team:Team {id: row.teamId})
      MATCH (person:Person {id: row.personId})
      MERGE (team)-[:HAS_MEMBER]->(person)
    `,
    parameters: {
      rows: teamMembers,
    },
  },

  {
    name: "bug-resolution relationships",
    query: `
      UNWIND $rows AS row
      MATCH (bug:Bug {id: row.bugId})
      MATCH (resolution:Resolution {id: row.resolutionId})
      MERGE (bug)-[:RESOLVED_BY]->(resolution)
    `,
    parameters: {
      rows: bugResolutions,
    },
  },

  {
    name: "resolution-document relationships",
    query: `
      UNWIND $rows AS row
      MATCH (resolution:Resolution {id: row.resolutionId})
      MATCH (document:Document {id: row.documentId})
      MERGE (resolution)-[:DOCUMENTED_IN]->(document)
    `,
    parameters: {
      rows: resolutionDocuments,
    },
  },

  {
    name: "bug-incident relationships",
    query: `
      UNWIND $rows AS row
      MATCH (bug:Bug {id: row.bugId})
      MATCH (incident:Incident {id: row.incidentId})
      MERGE (bug)-[:TRIGGERED]->(incident)
    `,
    parameters: {
      rows: bugIncidents,
    },
  },

  /* ---------------------------------------------------------------------- */
  /* Incident relationships                                                  */
  /* ---------------------------------------------------------------------- */

  {
    name: "customer-incident relationships",
    query: `
      UNWIND $rows AS row
      MATCH (customer:Customer {id: row.customerId})
      MATCH (incident:Incident {id: row.incidentId})
      MERGE (customer)-[:HAS_INCIDENT]->(incident)
    `,
    parameters: {
      rows: customerIncidents,
    },
  },

  {
    name: "incident-component relationships",
    query: `
      UNWIND $rows AS row
      MATCH (incident:Incident {id: row.incidentId})
      MATCH (component:Component {id: row.componentId})
      MERGE (incident)-[:AFFECTS]->(component)
    `,
    parameters: {
      rows: incidentComponents,
    },
  },

  {
    name: "incident-product relationships",
    query: `
      UNWIND $rows AS row
      MATCH (incident:Incident {id: row.incidentId})
      MATCH (product:Product {id: row.productId})
      MERGE (incident)-[:AFFECTS_PRODUCT]->(product)
    `,
    parameters: {
      rows: incidentProducts,
    },
  },

  {
    name: "incident-responder relationships",
    query: `
      UNWIND $rows AS row
      MATCH (incident:Incident {id: row.incidentId})
      MATCH (person:Person {id: row.personId})
      MERGE (incident)-[:RESPONDED_BY]->(person)
    `,
    parameters: {
      rows: incidentResponders,
    },
  },

  /* ---------------------------------------------------------------------- */
  /* Infrastructure relationships                                           */
  /* ---------------------------------------------------------------------- */

  {
    name: "component-vendor relationships",
    query: `
      UNWIND $rows AS row
      MATCH (component:Component {id: row.componentId})
      MATCH (vendor:Vendor {id: row.vendorId})
      MERGE (component)-[:USES]->(vendor)
    `,
    parameters: {
      rows: componentVendors,
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Seed execution                                                             */
/* -------------------------------------------------------------------------- */

const seed = async (): Promise<void> => {
  const driver = getDriver();

  try {
    console.log("");
    console.log("========================================");
    console.log("      ContextGraph Database Seed");
    console.log("========================================");
    console.log("");

    /*
     * IMPORTANT:
     *
     * Set SEED_RESET=true when you want a completely
     * fresh local graph.
     *
     * Example PowerShell:
     *
     * $env:SEED_RESET="true"
     * npm run seed
     *
     * Without SEED_RESET=true, MERGE is used and
     * existing compatible records are preserved.
     */

    if (process.env.SEED_RESET === "true") {
      console.log("Reset requested.");
      console.log("Clearing existing graph...");

      const resetSession = driver.session();

      try {
        await resetSession.run(`
          MATCH (n)
          DETACH DELETE n
        `);
      } finally {
        await resetSession.close();
      }

      console.log("Existing graph cleared.");
      console.log("");
    }

    console.log("Dataset summary");
    console.log("----------------------------------------");
    console.log(`Customers:     ${customers.length}`);
    console.log(`Tickets:       ${tickets.length}`);
    console.log(`Products:      ${products.length}`);
    console.log(`Features:      ${features.length}`);
    console.log(`Bugs:          ${bugs.length}`);
    console.log(`Incidents:     ${incidents.length}`);
    console.log(`Components:    ${components.length}`);
    console.log(`Teams:         ${teams.length}`);
    console.log(`People:        ${people.length}`);
    console.log(`Resolutions:   ${resolutions.length}`);
    console.log(`Documents:     ${documents.length}`);
    console.log(`Vendors:       ${vendors.length}`);
    console.log(`Environments:  ${environments.length}`);
    console.log("----------------------------------------");
    console.log("");

    for (const step of seedSteps) {
      console.log(`Seeding ${step.name}...`);

      const session = driver.session();

      try {
        await session.run(step.query, step.parameters);
      } finally {
        await session.close();
      }
    }

    console.log("");
    console.log("========================================");
    console.log(" ContextGraph seed completed successfully");
    console.log("========================================");
    console.log("");
    console.log("The graph now contains:");
    console.log("- Multiple enterprise customers");
    console.log("- Shared products and infrastructure");
    console.log("- Cross-customer support issues");
    console.log("- Bugs and recurring incidents");
    console.log("- Engineering ownership");
    console.log("- Support and incident responders");
    console.log("- Verified resolutions");
    console.log("- Supporting documentation");
    console.log("- Components and external vendors");
    console.log("- Production, staging and development environments");
    console.log("");
  } catch (error) {
    console.error("");
    console.error("Failed to seed ContextGraph:");
    console.error(error);
    console.error("");

    process.exitCode = 1;
  } finally {
    await driver.close();
  }
};

seed();