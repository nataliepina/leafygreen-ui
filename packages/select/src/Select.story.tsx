import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import Select, { Props as SelectProps } from './Select';
import { css } from '@leafygreen-ui/emotion';

class Example<V> extends Component<SelectProps<V, string>> {
  static defaultProps = {
    ...Select.defaultProps,
    dropdownTitle: '',
    searchPlaceholder: '',
    value: null,
  };

  state = {
    value: this.props.value,
  };

  render() {
    const {
      footer,
      options,
      itemToString,
      searchable,
      dropdownTitle,
      searchPlaceholder,
      disabled,
      usePortal,
      groupBy,
    } = this.props;

    return (
      <div
        className={css`
          width: 100%;
          text-align: center;
        `}
      >
        Current value: {this.state.value}
        <br />
        <div
          className={css`
            height: 40px;
            width: 40%;
            margin-left: 30%;
          `}
        >
          <Select
            value={this.state.value}
            footer={footer}
            onChange={value =>
              this.setState({
                value,
              })
            }
            options={options}
            itemToString={itemToString}
            searchable={searchable}
            dropdownTitle={dropdownTitle}
            searchPlaceholder={searchPlaceholder}
            style={{ height: '100%' }}
            disabled={disabled}
            usePortal={usePortal}
            groupBy={groupBy}
          />
        </div>
      </div>
    );
  }
}

storiesOf('Select', module)
  .add('docs', () => (
    <Example
      options={[
        { value: 1, label: 'One' },
        { value: 2, label: 'Two' },
        { value: 3, label: 'Three' },
      ]}
      value={1}
      itemToString={item => (item ? item.label : '')}
    />
  ))
  .add('searchable', () => (
    <div className="storybook-container storybook-container-is-left-aligned">
      <div className="storybook-container-example">
        <div className="storybook-container-example">
          <div className="storybook-container-header">Default Styled State</div>
          <Example
            options={[
              { value: 1, label: 'One' },
              { value: 2, label: 'Two' },
              { value: 3, label: 'Three' },
            ]}
            value={1}
            itemToString={item => (item ? item.label : '')}
            searchable
          />
        </div>
        <div className="storybook-container-header">Un-styled State</div>
        <Example
          options={[
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
            { value: 3, label: 'Three' },
          ]}
          value={1}
          itemToString={item => (item ? item.label : '')}
          searchable
        />
      </div>
    </div>
  ))
  .add('disabled', () => (
    <div className="storybook-container storybook-container-is-left-aligned">
      <div className="storybook-container-example">
        <div className="storybook-container-header">Default State</div>
        <Example
          options={[
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
            { value: 3, label: 'Three' },
          ]}
          itemToString={item => (item ? item.label : '')}
          value={1}
          searchable
          disabled
        />
      </div>
    </div>
  ))
  .add('searchable with title and placeholder', () => (
    <div className="storybook-container storybook-container-is-left-aligned">
      <div className="storybook-container-example">
        <div className="storybook-container-header">Default State</div>
        <Example
          options={[
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
            { value: 3, label: 'Three' },
          ]}
          itemToString={item => (item ? item.label : '')}
          searchable
          dropdownTitle="Sample Select Title"
          searchPlaceholder="Sample search placeholder..."
          footer={
            <div style={{ padding: '10px' }}>
              <button onClick={() => {}}>Click me</button>
            </div>
          }
        />
      </div>
    </div>
  ))
  .add('with title, not searchable', () => (
    <div className="storybook-container storybook-container-is-left-aligned">
      <div className="storybook-container-example">
        <div className="storybook-container-header">Default State</div>
        <Example
          options={[
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
            { value: 3, label: 'Three' },
          ]}
          itemToString={item => (item ? item.label : '')}
          searchable={false}
          dropdownTitle="Sample Select Title"
          footer={
            <div style={{ padding: '10px' }}>
              <button onClick={() => {}}>Click me</button>
            </div>
          }
        />
      </div>
    </div>
  ))
  .add('with option groups', () => (
    <div className="storybook-container storybook-container-is-left-aligned">
      <div className="storybook-container-example">
        <div className="storybook-container-header">Default State</div>
        <Example
          options={[
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
            { value: 3, label: 'Three' },
          ]}
          itemToString={item => (item ? item.label : '')}
          value={1}
          groupBy={({ label }) => `Starts with ${label[0]}`}
        />
      </div>
    </div>
  ))
  .add('footer', () => (
    <div className="storybook-container storybook-container-is-left-aligned">
      <div className="storybook-container-example">
        <div className="storybook-container-header">Default State</div>
        <Example
          options={[
            { value: 1, label: 'One' },
            { value: 2, label: 'Two' },
            { value: 3, label: 'Three' },
          ]}
          itemToString={item => (item ? item.label : '')}
          value={1}
          searchable
          footer={
            <div>
              <div className="select-menu-label">Label</div>
              <button onClick={() => {}}>Click me</button>
            </div>
          }
        />
      </div>
    </div>
  ))
  .add('inside a table row', () => (
    <div className="storybook-container storybook-container-is-left-aligned">
      <div className="storybook-container-example">
        <table
          style={{
            border: '1px solid #aaa',
            borderCollapse: 'collapse',
            width: '100%',
          }}
        >
          <tbody>
            <tr>
              <td style={{ border: '1px solid #aaa' }}>
                <Select
                  options={[
                    { value: 1, label: 'One' },
                    { value: 2, label: 'Two' },
                    { value: 3, label: 'Three' },
                  ]}
                  itemToString={item => (item ? item.label : '')}
                  value={1}
                />
              </td>
              <td style={{ border: '1px solid #aaa' }}>
                <Select
                  options={[
                    { value: 1, label: 'One' },
                    { value: 2, label: 'Two' },
                    { value: 3, label: 'Three' },
                  ]}
                  itemToString={item => (item ? item.label : '')}
                  value={1}
                  groupBy={({ label }) => `Starts with ${label[0]}`}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ))
  .add('using portals', () => (
    <div className="storybook-container storybook-container-is-left-aligned">
      <div className="storybook-container-example">
        <div className="storybook-container-header">Default State</div>
        <div style={{ overflow: 'hidden', height: '50px' }}>
          <Example
            options={[
              { value: 1, label: 'One' },
              { value: 2, label: 'Two' },
              { value: 3, label: 'Three' },
            ]}
            itemToString={item => (item ? item.label : '')}
            value={1}
            searchable
            footer={
              <div>
                <div className="select-menu-label">Label</div>
                <button onClick={() => {}}>Click me</button>
              </div>
            }
            usePortal
          />
        </div>
      </div>
    </div>
  ));
