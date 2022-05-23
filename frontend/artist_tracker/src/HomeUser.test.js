import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomeUser from './HomeUser';
 
it ('renders without crashing', function () {
    render (<MemoryRouter><HomeUser /></MemoryRouter>);
})