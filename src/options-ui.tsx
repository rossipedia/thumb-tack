import * as React from 'react';
import { render } from 'react-dom';

import styled, { injectGlobal } from 'styled-components';

const manifest = chrome.runtime.getManifest();

injectGlobal`
    body {
        height: 100vh;
        font-size: 14px;
        display: grid;
        place-items: start center;
    }
`;

const Container = styled.div`
    width: 50vh;
    padding: 1em;
    border-radius: 10px;
    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.3);
`;

const Header = styled.header`
`;

const Title = styled.h1`
`;
const Description = styled.p`
`;

const Version = styled.span`
`;



const App = () => (
    <Container>
        <Header>
            <Title>{manifest.name}</Title>
            <Version>
                {manifest.version_name
                    ? manifest.version_name
                    : manifest.version}
            </Version>
            <Description>{manifest.description}</Description>
        </Header>
    </Container>
);

render(<App />, document.getElementById('root'));
