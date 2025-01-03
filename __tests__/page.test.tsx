import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '@/app/(authenticated)/dashboard/page';
 
describe('Page', () => {
  it('renders a dashboard', () => {
    render(<Page />)
 
    const heading = screen.getByText('dashboard')
 
    expect(heading).toBeInTheDocument()
  })
})