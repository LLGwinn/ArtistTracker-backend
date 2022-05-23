import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userContext from './userContext';
import EventList from './EventList';

it ('renders without crashing', () => {
    const currUser = {name: 'Curr'};
    render (<MemoryRouter >
                <userContext.Provider value={currUser}>
                    <EventList />
                </userContext.Provider>
            </MemoryRouter>)
});

