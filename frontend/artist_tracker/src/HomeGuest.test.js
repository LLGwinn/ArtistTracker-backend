import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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


