import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userContext from './userContext';
import AddArtistForm from './AddArtistForm';

it ('renders without crashing', () => {
    const currUser = {name: 'Curr'};
    render (<MemoryRouter initialEntries={['/HomeUser']}>
                <userContext.Provider value={currUser}>
                    <AddArtistForm />
                </userContext.Provider>
            </MemoryRouter>)
});


