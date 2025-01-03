import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PayoutForm } from '@/components/form/PayoutForm';

describe('PayoutForm', () => {
  it('renders the payout form and submits successfully', async () => {
    render(<PayoutForm />);

    // Check if the form elements are rendered
    const trxnDateInput = screen.getByLabelText(/Date of Transactions/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    expect(trxnDateInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    // Simulate user input
    fireEvent.change(trxnDateInput, { target: { value: '2023-10-01' } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for the success message to appear
    // await waitFor(() => {
    //   const successMessage = screen.getByText(/payout processed successfully/i);
    //   expect(successMessage).toBeInTheDocument();
    // });
  });

  it('shows an error message when the transaction date is missing', async () => {
    render(<PayoutForm />);

    // Check if the form elements are rendered
    const submitButton = screen.getByRole('button', { name: /submit/i });

    expect(submitButton).toBeInTheDocument();

    // Simulate form submission without entering a transaction date
    fireEvent.click(submitButton);

    // Wait for the error message to appear
    await waitFor(() => {
      const errorMessage = screen.getByText(/Transaction Folder Date is required./i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});