# TODO for Real Payment Method Integration and Transaction Tests

## Backend
- [x] Setup environment variables for real payment API keys in `.env`
- [ ] Verify paymentService.js uses environment variables for real API keys
- [ ] Add unit tests for paymentService methods with fake wallet simulation
- [ ] Add integration tests for paymentController and transactionController endpoints

## Frontend
- [ ] Verify PaymentSettings.js supports adding real payment methods
- [ ] Add tests for payment method addition and deletion flows
- [ ] Add tests for deposit, withdrawal, and trade transaction flows using fake wallet

## Testing
- [ ] Perform manual testing of payment method addition and transactions using fake wallet
- [ ] Ensure no changes to existing unrelated features
- [ ] Validate error handling and edge cases for payment and transaction flows

## Follow-up
- [ ] User to replace temporary API keys in `.env` with real keys
- [ ] Monitor logs and errors during real payment gateway usage
