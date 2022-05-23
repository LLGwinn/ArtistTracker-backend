import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userContext from './userContext';
import HomeUser from './HomeUser';

let testVars;

beforeEach(() => {
    const currUser = {id: 1, firstName:'Test', city: 12345}
    const usersSavedArtists = {id:'123ABC', name:'Test Art'}
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY1MzA3ODE2Mn0.fFALYeE4PBT3siReIbxZVqFN4Tct-dTXzN9ELTsxy-8';
    testVars = {currUser, usersSavedArtists, token};
})

it ('renders without crashing', function() {
    const { getByText } = render (<MemoryRouter initialEntries={['/']}>
                                    <userContext.Provider value={testVars}>
                                        <HomeUser />
                                    </userContext.Provider>
                                </MemoryRouter>)
    const greeting = getByText(`Hi there, Test!`);

    expect(greeting).toBeInTheDocument();
})

it ('renders EventList', function() {
    const { getByText } = render (<MemoryRouter initialEntries={['/']}>
                                    <userContext.Provider value={testVars}>
                                        <HomeUser />
                                    </userContext.Provider>
                                </MemoryRouter>)
    const eventListMessage = getByText(`Save artists to automatically see upcoming shows!`);

    expect(eventListMessage).toBeInTheDocument();
})

it ('renders unauthorized page if no token', function() {
    testVars.token = null;
    const { getByText } = render (<MemoryRouter initialEntries={['/']}>
                                    <userContext.Provider value={testVars}>
                                        <HomeUser />
                                    </userContext.Provider>
                                </MemoryRouter>)
    const message = getByText(`Oops...`);

    expect(message).toBeInTheDocument();
})


