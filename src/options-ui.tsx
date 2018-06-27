import * as React from 'react';
import { render } from 'react-dom';

import styled, { injectGlobal } from 'styled-components';
import { IOptions, PinType, getOptions, storeOptions } from './common';

import produce from 'immer';

const manifest = chrome.runtime.getManifest();

injectGlobal`
    body {
        height: 100vh;
        font-size: 14px;
        display: grid;
        place-items: start center;
        font-family: Arial;
    }
`;

const Container = styled.div`
    width: 1024px;
    padding: 1em;
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

// const Description = styled.p`
//     margin: 0;
//     font-style: italic;
// `;

const Version = styled.span`
    color: #666;
    font-family: monospace;
    font-size: 80%;
    margin-left: 10px;
`;

const RulesList = styled.div`
    display: grid;
    grid: auto-flow / auto 1fr auto;
    gap: 5px;
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
    font-size: 12px;
`;

const ValueInput = ({
    value,
    onChange,
}: {
    value: string;
    onChange: React.FormEventHandler<HTMLInputElement>;
}) => <ValueInputField type="text" value={value} onChange={onChange} />;

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
    font-size: 80%;
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

function debounce<TFn extends (...args: any[]) => any>(
    fn: TFn,
    wait: number,
    context?: any,
) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(context || this, arguments);
        }, wait);
    } as TFn;
}

interface OptionsEditorProps {}
interface OptionsEditorState {
    options: IOptions;
}

class App extends React.Component<OptionsEditorProps, OptionsEditorState> {
    state: OptionsEditorState = {
        options: null,
    };

    async componentDidMount() {
        const options = await getOptions();
        this.setState(() => ({ options }));
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.options != null &&
            prevState.options !== this.state.options
        ) {
            this.persist();
        }
    }

    persist = debounce(async function(this: App) {
        await storeOptions(this.state.options);
        console.log('settings synced');
    }, 500);

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

    render() {
        const { options } = this.state;
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

                <RulesList>
                    {options.rules.map((rule, i) => (
                        <RuleRow key={i}>
                            <select
                                value={rule.type}
                                onChange={e =>
                                    this.setRuleType(i, +e.currentTarget.value)
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
                                    this.setRuleValue(i, e.currentTarget.value)
                                }
                            />
                            <DeleteButton onClick={() => this.removeRule(i)} />
                        </RuleRow>
                    ))}
                    <RuleRow>
                        <div>
                            <AddButton onClick={this.addRule}>
                                <AddIcon />
                                <span>Add Rule</span>
                            </AddButton>
                        </div>
                    </RuleRow>
                </RulesList>
            </Container>
        );
    }
}

render(<App />, document.getElementById('root'));
