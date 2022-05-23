import { fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import HomeGuest from './HomeGuest';

it ('renders without crashing', function() {
  render(<MemoryRouter><HomeGuest /></MemoryRouter>);
});

it ('renders the GuestForm component', function() {
    const { getByText } = render(<MemoryRouter><HomeGuest /></MemoryRouter>); 
    const artistLabel = getByText('Which artist would you like to see?');
    const searchButton = getByText('Find my artist!');

    expect(artistLabel).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
})

it ('renders the login and signup buttons as links', function() {
    const { getByText } = render(<MemoryRouter><HomeGuest /></MemoryRouter>); 

    const loginButton = getByText('Log In');
    const signupButton = getByText('Sign me up!');

    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute('href', '/login');
    expect(signupButton).toBeInTheDocument();
    expect(signupButton).toHaveAttribute('href', '/signup');
})

it ('handles login button click', async function() {
  const {getByRole, getByText} = render (
      <MemoryRouter initalEntries={['/login']}>
        <HomeGuest />
      </MemoryRouter>
  );
  const loginButton = getByRole('button', {name: 'Log In'});
  fireEvent.click(loginButton);
  
  expect(getByText('Username')).toBeInTheDocument();
  
});
