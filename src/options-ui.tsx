import * as React from 'react';
import { render } from 'react-dom';

import styled, { injectGlobal, keyframes } from 'styled-components';
import { IOptions, PinType, getOptions, storeOptions } from './common';

import produce from 'immer';

const manifest = chrome.runtime.getManifest();

injectGlobal`
    body {
        /* font-size: 14px; */
        font-family: Arial;
    }
`;

const Container = styled.div`
    box-sizing: border-box;
    width: 800px;
    padding: 0 1em 1em;
    margin: auto;
`;

const Header = styled.header`
    border-bottom: 1px solid #ccc;
    padding-bottom: 1em;
    margin-bottom: 1em;
`;

const Title = styled.div`
    display: flex;
    align-items: baseline;
    * {
        margin: 3px;
    }
`;

const IconImage = ({ size }: { size: '16' | '32' | '48' | '64' | '128' }) => (
    <img src={manifest.icons[size]} />
);

const Version = styled.span`
    color: #666;
    font-family: monospace;
    /* font-size: 80%; */
    margin-left: 10px;
`;

const RulesList = styled.div`
    display: grid;
    grid: auto-flow / auto 1fr auto;
    gap: 5px;
    padding-bottom: 1em;
    margin-bottom: 1em;
    border-bottom: 1px solid #ccc;
`;

const RuleRow = React.Fragment;

const DeleteButton = styled((p: React.HTMLProps<HTMLDivElement>) => (
    <div {...p} title="Delete">
        <svg viewBox="0 0 16 16" style={{ stroke: 'currentColor' }}>
            <path strokeWidth="2" d="M4,8 l8,0" />
        </svg>
    </div>
))`
    border-radius: 3px;
    width: 16px;
    height: 16px;
    cursor: pointer;
    align-self: center;

    color: #ccc;
    border: 1px solid #ccc;
    background-color: #eee;
    transition: all 85ms linear;
    &:hover {
        color: white;
        border: 1px solid #c00;
        background-color: red;
    }
`;

const ValueInputField = styled.input`
    font-family: monospace;
    /* font-size: 12px; */
`;

const ValueInput = ({
    value,
    onChange,
    placeholder
}: {
    value: string;
    onChange: React.FormEventHandler<HTMLInputElement>;
    placeholder?: string;
}) => <ValueInputField type="text" value={value} onChange={onChange} placeholder={placeholder} />;

const AddIcon = () => (
    <svg
        viewBox="0 0 16 16"
        height="16"
        width="16"
        strokeWidth="2"
        style={{ stroke: 'currentColor' }}
    >
        <path d="M4,8 l8,0 M8,4 l0,8" />
    </svg>
);

const AddButton = styled.button`
    /* font-size: 80%; */
    border-radius: 3px;
    transition: all 85ms linear;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 3px 5px;

    border: 1px solid #ccc;
    background-color: #eee;
    color: #333;
    font-weight: bold;

    &:hover {
        color: green;
        border-color: green;
        background-color: #ecf9ec;
    }
`;

const SyncWrap = styled.div`
    grid-column-start: 2;
    grid-column-end: 4;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const SyncMessage = styled.span`
    display: inline-block;
    color: #4a4;
    font-weight: bold;

    &.none {
        opacity: 0; /* hide by default */
        transition: opacity 0.25s ease-in;
    }

    &.done {
        opacity: 1;
        transition: opacity 0.125s linear;
    }

    &.pending {
        opacity: 0;
        transition: none;
    }
`;

const ExtensionInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    > * {
        display: inline-block;
        margin-right: 1em;
    }
    .icon {
        height: 16px;
        width: 16px;
    }
`;

const GithubIcon = () => (
    <svg
        viewBox="0 0 1024 1024"
        height="16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
        fill="#555"
    >
        <path d="M512 0C229.25 0 0 229.25 0 512c0 226.25 146.688 418.125 350.156 485.812 25.594 4.688 34.938-11.125 34.938-24.625 0-12.188-0.469-52.562-0.719-95.312C242 908.812 211.906 817.5 211.906 817.5c-23.312-59.125-56.844-74.875-56.844-74.875-46.531-31.75 3.53-31.125 3.53-31.125 51.406 3.562 78.47 52.75 78.47 52.75 45.688 78.25 119.875 55.625 149 42.5 4.654-33 17.904-55.625 32.5-68.375C304.906 725.438 185.344 681.5 185.344 485.312c0-55.938 19.969-101.562 52.656-137.406-5.219-13-22.844-65.094 5.062-135.562 0 0 42.938-13.75 140.812 52.5 40.812-11.406 84.594-17.031 128.125-17.219 43.5 0.188 87.312 5.875 128.188 17.281 97.688-66.312 140.688-52.5 140.688-52.5 28 70.531 10.375 122.562 5.125 135.5 32.812 35.844 52.625 81.469 52.625 137.406 0 196.688-119.75 240-233.812 252.688 18.438 15.875 34.75 47 34.75 94.75 0 68.438-0.688 123.625-0.688 140.5 0 13.625 9.312 29.562 35.25 24.562C877.438 930 1024 738.125 1024 512 1024 229.25 794.75 0 512 0z" />
    </svg>
);

const TwitterLogo = () => (
    <svg
        height="16"
        width="16"
        id="Logo_FIXED"
        data-name="Logo — FIXED"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 400"
        fill="#555"
        style={{ transform: 'scale(1.5)' }}
    >
        <defs>
            <style>{`.cls-1{fill:none;}.cls-2{fill:#555;}`}</style>
        </defs>
        <rect className="cls-1" width="400" height="400" />
        <path
            className="cls-2"
            d="M153.62,301.59c94.34,0,145.94-78.16,145.94-145.94,0-2.22,0-4.43-.15-6.63A104.36,104.36,0,0,0,325,122.47a102.38,102.38,0,0,1-29.46,8.07,51.47,51.47,0,0,0,22.55-28.37,102.79,102.79,0,0,1-32.57,12.45,51.34,51.34,0,0,0-87.41,46.78A145.62,145.62,0,0,1,92.4,107.81a51.33,51.33,0,0,0,15.88,68.47A50.91,50.91,0,0,1,85,169.86c0,.21,0,.43,0,.65a51.31,51.31,0,0,0,41.15,50.28,51.21,51.21,0,0,1-23.16.88,51.35,51.35,0,0,0,47.92,35.62,102.92,102.92,0,0,1-63.7,22A104.41,104.41,0,0,1,75,278.55a145.21,145.21,0,0,0,78.62,23"
        />
    </svg>
);

function getNewIssueBody(error: Error, info: { componentStack: string }) {
    return encodeURIComponent(
        `#### Describe what you were doing:

(enter actions to reproduce here)

#### Error info:

\`\`\`
${error.stack || error.toString()}
\`\`\`

${
            info.componentStack
                ? `\`\`\`
${info.componentStack}
\`\`\`
`
                : ''
        }
`,
    );
}

const NewIssueLink = ({
    children,
    title,
    error,
    info,
}: {
    children: React.ReactNode;
    title?: string;
    error: Error;
    info?: any;
}) => (
    <a
        target="_blank"
        href={
            `https://github.com/rossipedia/thumb-tack/issues/new?body=` +
            getNewIssueBody(error, info)
        }
        title={title}
    >
        {children}
    </a>
);

const ErrorInfo = styled.div`
    border: 1px solid mistyrose;
    border-radius: 5px;
    padding: 1em;
    color: maroon;
    background-color: lavenderblush;
    margin-bottom: 1em;
`;

const HelpPre = styled.div`
    white-space: pre-wrap;
    font-family: monospace;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 0.5em;
    color: #444;
    margin: 1em 0;
`;

interface OptionsEditorProps {}
interface OptionsEditorState {
    options: IOptions;
    syncState: 'none' | 'done' | 'pending';
    error: {
        err: Error;
        info?: any;
    };
}

class App extends React.Component<OptionsEditorProps, OptionsEditorState> {
    state: OptionsEditorState = {
        options: null,
        syncState: 'none',
        error: null,
    };

    componentDidCatch(error, info) {
        this.setState({ error: { err: error, info } });
    }

    persistTimeout: any = null;
    syncMessageClearTimeout: any = null;

    async componentDidMount() {
        const options = await getOptions();
        this.setState(() => ({ options }));
    }

    setStatePromise(
        reducer:
            | ((
                  state: Readonly<OptionsEditorState>,
              ) => Partial<OptionsEditorState>)
            | Partial<OptionsEditorState>,
    ) {
        return new Promise(resolve => {
            this.setState(reducer as any, () => resolve());
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (
            prevState.options != null &&
            prevState.options !== this.state.options
        ) {
            clearTimeout(this.persistTimeout);
            clearTimeout(this.syncMessageClearTimeout);

            await this.setStatePromise({ syncState: 'pending' });

            this.persistTimeout = setTimeout(
                async state => {
                    try {
                        console.log('syncing...');
                        await storeOptions(state.options);
                        await this.setStatePromise({ syncState: 'done' });
                        console.log('...finished');
                        this.syncMessageClearTimeout = setTimeout(() => {
                            this.setState({ syncState: 'none' });
                        }, 2000);
                    } catch (err) {
                        this.setState({ error: { err } });
                    }
                },
                1000,
                this.state,
            );
        }
    }

    async persist() {
        await storeOptions(this.state.options);
        console.log('settings synced');
    }

    setRuleType = (index: number, newType: PinType) => {
        this.setState(state =>
            produce(state, (draft: OptionsEditorState) => {
                draft.options.rules[index].type = newType;
            }),
        );
    };

    setRuleValue = (index: number, value: string) => {
        this.setState(state =>
            produce(state, (draft: OptionsEditorState) => {
                draft.options.rules[index].value = value;
            }),
        );
    };

    addRule = () => {
        this.setState(state =>
            produce(state, (draft: OptionsEditorState) => {
                draft.options.rules.push({
                    type: PinType.UrlExact,
                    value: '',
                });
            }),
        );
    };

    removeRule = (index: number) => {
        this.setState(state =>
            produce(state, (draft: OptionsEditorState) => {
                draft.options.rules.splice(index, 1);
            }),
        );
    };
    /*

    */

    render() {
        const { options, syncState, error } = this.state;
        if (options === null) {
            return null;
        }

        return (
            <Container>
                <Header>
                    <Title>
                        <IconImage size="48" />
                        <h1>{manifest.name}</h1>
                        <Version>
                            {manifest.version_name
                                ? manifest.version_name
                                : manifest.version}
                        </Version>
                    </Title>
                </Header>
                {error == null ? (
                    <>
                        <p>
                            Enter your rules below. Changes will automatically
                            be synced across devices.
                        </p>
                        <p>
                            </p>
                        <RulesList>
                            {options.rules.map((rule, i) => (
                                <RuleRow key={i}>
                                    <select
                                        value={rule.type}
                                        onChange={e =>
                                            this.setRuleType(
                                                i,
                                                +e.currentTarget.value,
                                            )
                                        }
                                    >
                                        <option value={PinType.UrlExact}>
                                            URL is exactly:
                                        </option>
                                        <option value={PinType.UrlMatch}>
                                            URL matches:
                                        </option>
                                        <option value={PinType.DomainExact}>
                                            URLs on the domain:
                                        </option>
                                        <option value={PinType.DomainMatch}>
                                            URLs with domain matching:
                                        </option>
                                    </select>
                                    <ValueInput
                                        value={String(rule.value)}
                                        onChange={e =>
                                            this.setRuleValue(
                                                i,
                                                e.currentTarget.value,
                                            )
                                        }

                                        placeholder={
                                            rule.type === PinType.DomainMatch ||
                                            rule.type === PinType.UrlMatch ?
                                            'Enter a regular expression'
                                            : ''
                                        }
                                    />
                                    <DeleteButton
                                        onClick={() => this.removeRule(i)}
                                    />
                                </RuleRow>
                            ))}
                            <RuleRow>
                                <div>
                                    <AddButton onClick={this.addRule}>
                                        <AddIcon />
                                        <span>Add Rule</span>
                                    </AddButton>
                                </div>
                                <SyncWrap>
                                    <SyncMessage className={syncState}>
                                        Settings synced
                                    </SyncMessage>
                                </SyncWrap>
                            </RuleRow>
                        </RulesList>
                    </>
                ) : (
                    <ErrorInfo>
                        <strong>An error has occurred.</strong>
                        <p>
                            To report a problem, please{' '}
                            <NewIssueLink error={error.err} info={error.info}>
                                file an issue
                            </NewIssueLink>{' '}
                            and include the following information:
                        </p>

                        <ul>
                            <li>Browser and Version</li>
                            <li>The action you were trying to perform</li>
                            {error.err.stack ? (
                                <li>
                                    The following stack trace:
                                    <HelpPre>{error.err.stack}</HelpPre>
                                </li>
                            ) : null}
                            <li>
                                Your current rules <strong>(optional)</strong>:
                                <HelpPre>
                                    {JSON.stringify(
                                        this.state.options.rules,
                                        undefined,
                                        2,
                                    )}
                                </HelpPre>
                            </li>
                        </ul>
                    </ErrorInfo>
                )}
                <ExtensionInfo>
                    <span>&copy; 2018 Bryan Ross</span>
                    <a
                        className="icon"
                        target="_blank"
                        href="https://github.com/rossipedia/thumb-tack"
                        title="View on GitHub"
                    >
                        <GithubIcon />
                    </a>
                    <a
                        className="icon"
                        target="_blank"
                        href="https://twitter.com/rossipedia"
                        title="@rossipedia on Twitter"
                    >
                        <TwitterLogo />
                    </a>
                </ExtensionInfo>
            </Container>
        );
    }
}

render(<App />, document.getElementById('root'));
