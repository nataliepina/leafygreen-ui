import React, { Component, Fragment } from 'react';
import DownshiftComponent, {
  ControllerStateAndHelpers,
  StateChangeOptions,
  DownshiftInterface,
} from 'downshift';
import Popover from '@leafygreen-ui/popover';
import { cx, css } from '@leafygreen-ui/emotion';
import { uiColors } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';

/**
 * Downshift doesn't seem to properly support generics on its default export,
 * but it does have the genericized types defined, so this function adds the
 * item type for TypeScript's benefit.
 */
function getDownshift<T>() {
  return DownshiftComponent as DownshiftInterface<T>;
}

const innerBorderColor = uiColors.gray.light2;
const inputAreaPadding = 4;
const arrowWidth = 8;
const arrowMargin = 5;
const searchIconWidth = 13;
const searchIconMargin = 5;
const inputBorderWidth = 1;
const inputPadding = 4;
const selectedValueWidth = 66;
const controlButtonPadding = 6;

const controlButtonStyles = css`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background: none;
  border: 0;
  box-shadow: none;
  border-radius: 3px;
  padding: 2px ${controlButtonPadding}px;
`;

const controlButtonArrowStyles = css`
  margin-left: ${arrowMargin}px;
  margin-right: 1px;
  color: ${innerBorderColor};
`;

const currentValueStyles = css`
  flex: 1;
  text-align: left;
  width: ${selectedValueWidth}px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 2px;
`;

const currentValuePlaceholderStyles = css`
  font-weight: 800;
  padding: 8px;
`;

const currentValueIconStyles = css`
  padding-right: 5px;
`;

const openAreaStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  background: ${uiColors.white};
  border: 1px solid ${uiColors.gray.light1};
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  overflow: visible;
  z-index: 10;
`;

const openAreaControlButtonStyles = css`
  padding: 7px ${inputBorderWidth}px 0;

  /* Special top padding given to the input when embedded in a table */
  td & {
    padding-top: 0;
  }
`;

const inputAreaStyles = css`
  padding: ${inputPadding}px;
  display: flex;
  align-items: center;
  position: relative;
`;

const inputAreaStylesWithTitle = css`
  display: block;
`;

const inputStyles = css`
  border: ${inputBorderWidth}px solid ${innerBorderColor};
  border-radius: 2px;
  display: block;
  flex: 1;
  padding: ${inputPadding}px;
  padding-right: ${searchIconWidth + searchIconMargin + inputPadding}px;
`;

const inputSearchIconStyles = css`
  color: ${uiColors.gray.light1};
  position: absolute;
  right: ${inputAreaPadding +
    arrowWidth +
    arrowMargin +
    inputBorderWidth +
    inputPadding}px;
  width: ${searchIconWidth};
  opacity: 0.4;
  bottom: 13px;
`;

const inputSearchIconStylesWithTitle = css`
  right: 14px;
`;

const inputAfterTitleStyles = css`
  width: 100%;
`;

const inputCloseButtonStyles = css`
  background: none;
  border: 0;
  margin-right: 1px;
  padding: 0;
`;

const inputCloseButtonStylesWithTitle = css`
  display: block;
`;

const inputArrowWrapperStyles = css`
  color: ${innerBorderColor};
  width: ${arrowWidth}px;
  margin-left: ${arrowMargin}px;
`;

const inputArrowWrapperStylesWithTitle = css`
  position: absolute;
  top: ${inputAreaPadding}px;
  right: 10px;
`;

const menuStyles = css`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const scrollableMenuStyles = css`
  height: 200px;
  overflow-y: scroll;
`;

const menuTitleStyles = css`
  flex: 1 1 100%;
  font-weight: 800;
  margin-bottom: ${controlButtonPadding}px;
  margin-top: 2px;
  margin-left: 3px;
  padding: 0 1px;
  text-align: left;
`;

const menuGroupStyles = css`
  margin: ${inputAreaPadding}px;
  padding: ${inputAreaPadding}px;
  color: ${uiColors.gray.base};
  font-weight: bold;
`;

const menuItemStyles = css`
  cursor: pointer;
  margin: ${inputAreaPadding}px;
  padding: ${inputAreaPadding}px;
`;

const highlightedMenuItemStyles = css`
  background: ${uiColors.blue.light2};
`;
const selectedMenuItemStyles = css`
  font-weight: bold;
`;
const groupedMenuItemStyles = css`
  padding-left: ${4 * inputAreaPadding}px;
`;

const menuFooterStyles = css`
  border-top: 1px solid ${innerBorderColor};
  padding: 7px;
`;

const menuLabelStyles = css`
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  color: ${uiColors.gray.base};
  padding-bottom: 10px;
  display: block;
`;

/**
 * A non-visible element to take up the space vacated by the select-control-button when the menu is opened.
 * Having it here prevents a "jump" when in layout flow, for example inside a table row, or inside a floated
 * element.
 */
const spacingPlaceholderStyles = css`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-right: ${arrowWidth + arrowMargin}px;

  visibility: hidden;
  pointer-events: none;
  z-index: -1;
  position: relative;
`;

const spacingPlaceholderValueStyles = css`
  flex: 1;
  text-align: left;
  /* This calc is a heuristic to try and prevent width collapse when the component's embedded in a table. */
  width: ${selectedValueWidth + controlButtonPadding * 2}px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

interface Item<Value, Label extends React.ReactNode> {
  readonly label: Label;
  readonly value: Value;
}

export interface Props<Value, Label extends React.ReactNode = React.ReactNode> {
  // Required props
  options: ReadonlyArray<Item<Value, Label>>;
  value: Value | null | undefined;

  // Optional props
  className?: string;
  controlButtonClassName?: string;
  disabled: boolean;
  footer?: React.ReactNode;
  /** Defaults to case-insensitive check against itemToString */
  getFilterFunction?: (
    filterText: string,
  ) => (item: Item<Value, Label>) => boolean;
  getItemKey: (item: Item<Value, Label>) => string; // Defaults to value
  inputAreaClassName?: string;
  /** itemToDisplayString is used for places where a value needs to be displayed and the full React.Node type isn't
   * supported. For example, the input's placeholder. Defaults to `itemToString` */
  itemToDisplayString?: (item?: Item<Value, Label> | null) => string;
  /** Defaults to (item) => (item == null ? '' : String(item.value)) */
  itemToString: (item?: Item<Value, Label> | null) => string;
  onChange: (val?: Value | null) => void;
  onClose: () => void;
  onOpen: () => void;
  optionListClassName?: string;
  searchable: boolean;
  style?: React.CSSProperties;
  title?: Value;
  dropdownTitle?: React.ReactNode;
  searchPlaceholder?: string;
  selectMenuClassName?: string;
  valueIsEqual: (lhs: Value, rhs: Value) => boolean;
  usePortal: boolean;
  /** groupBy can be used to group options into optgroups. To use a flat set of options, this should map to empty string */
  groupBy: (item: Item<Value, Label>) => string;
}

interface State {
  inputValue: string;
  dimensions: { top: number; left: number; width: number } | null;
}

class Select<
  Value,
  Label extends React.ReactNode = React.ReactNode
> extends Component<Props<Value, Label>, State> {
  static defaultProps = {
    className: undefined,
    controlButtonClassName: undefined,
    disabled: false,
    footer: undefined,
    getFilterFunction: undefined,
    getItemKey: (i: Item<{}, React.ReactNode>) => String(i.value),
    inputAreaClassName: undefined,
    itemToDisplayString: undefined,
    itemToString: (i?: Item<{}, React.ReactNode>) =>
      i == null ? '' : String(i.value),
    onChange: () => {},
    onClose: () => {},
    onOpen: () => {},
    optionListClassName: undefined,
    searchable: false,
    style: undefined,
    title: '',
    dropdownTitle: undefined,
    searchPlaceholder: undefined,
    selectMenuClassName: undefined,
    valueIsEqual: (val1: {}, val2: {}) => val1 === val2,
    usePortal: false,
    groupBy: () => '',
  };

  state: State = {
    inputValue: '',
    dimensions: null,
  };

  getSelectedItem(): Item<Value, Label> | null {
    const { value: currentValue } = this.props;

    if (currentValue == null) {
      return null;
    }

    return (
      this.props.options.find(item =>
        this.props.valueIsEqual(item.value, currentValue),
      ) || null
    );
  }

  inputRef: HTMLInputElement | null = null;

  openButtonRef: HTMLButtonElement | null = null;

  handleChange = (
    item: Item<Value, Label> | null | undefined,
    { closeMenu }: ControllerStateAndHelpers<Item<Value, Label>>,
  ) => {
    closeMenu();
    this.props.onChange(item && item.value);
  };

  render() {
    // TS workaround to deal with Downshift's weird exports that don't parameterize their component
    const Downshift = getDownshift<Item<Value, Label>>();

    const {
      className,
      controlButtonClassName,
      disabled,
      footer,
      inputAreaClassName,
      itemToString,
      optionListClassName,
      options,
      searchPlaceholder,
      dropdownTitle,
      searchable,
      style,
      title,
      getItemKey,
      usePortal,
      groupBy,
    } = this.props;

    const {
      getFilterFunction = (text: string) => (item: Item<Value, Label>) =>
        itemToString(item)
          .toLocaleLowerCase()
          .indexOf(text.toLocaleLowerCase()) !== -1,
      itemToDisplayString = itemToString,
    } = this.props;

    const { inputValue: stateInputValue } = this.state;

    const hasDropdownTitle =
      dropdownTitle != null && dropdownTitle !== false && dropdownTitle !== '';

    return (
      <Downshift
        selectedItem={this.getSelectedItem()}
        onChange={this.handleChange}
        itemToString={itemToString}
        inputValue={searchable ? stateInputValue : ''}
        onInputValueChange={
          searchable ? inputValue => this.setState({ inputValue }) : undefined
        }
      >
        {({
          closeMenu,
          getToggleButtonProps,
          getInputProps,
          getItemProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem,
        }) => {
          const filteredOptions = searchable
            ? options.filter(getFilterFunction(inputValue || ''))
            : options;
          const groups: ReadonlyArray<{
            label: string;
            items: ReadonlyArray<Item<Value, Label>>;
          }> = filteredOptions.reduce(
            (acc, option) => {
              const label = groupBy(option);
              const index = acc.findIndex(g => g.label === label);
              let group: { label: string; items: Array<Item<Value, Label>> };

              if (index === -1) {
                group = { label, items: [] };
                acc.push(group);
              } else {
                group = acc[index];
              }
              group.items.push(option);
              return acc;
            },
            [] as Array<{ label: string; items: Array<Item<Value, Label>> }>,
          );
          let itemIndex = 0;

          return (
            <div
              className={cx(
                css`
                  position: relative;
                `,
                className,
              )}
              style={style}
            >
              <Popover usePortal={usePortal} active={isOpen}>
                <div
                  {...getMenuProps({
                    className: openAreaStyles,
                  })}
                >
                  <div
                    className={cx(inputAreaStyles, inputAreaClassName, {
                      [inputAreaStylesWithTitle]: hasDropdownTitle,
                    })}
                  >
                    {searchable ? (
                      <Fragment>
                        {dropdownTitle && (
                          <button
                            {...getToggleButtonProps({
                              className: cx(
                                inputCloseButtonStyles,
                                inputCloseButtonStylesWithTitle,
                              ),
                            })}
                          >
                            <p className={menuTitleStyles}>{dropdownTitle}</p>
                            <span
                              className={cx(inputArrowWrapperStyles, {
                                [inputArrowWrapperStylesWithTitle]: hasDropdownTitle,
                              })}
                            >
                              <Icon glyph="CaretUp" />
                            </span>
                          </button>
                        )}
                        <input
                          {...getInputProps({
                            className: cx(inputStyles, {
                              [inputAfterTitleStyles]: hasDropdownTitle,
                            }),
                            placeholder:
                              itemToDisplayString(selectedItem) ||
                              searchPlaceholder,
                            ref: inputRef => {
                              this.inputRef = inputRef;
                            },
                          })}
                        />
                        {/* TODO: Add search icon instead of this placeholder once we have the glyph in <Icon> */}
                        <i
                          className={cx(inputSearchIconStyles, {
                            [inputSearchIconStylesWithTitle]: hasDropdownTitle,
                          })}
                        />
                        {hasDropdownTitle && (
                          <button
                            {...getToggleButtonProps({
                              key: 'close',
                              className: cx(
                                inputCloseButtonStyles,
                                inputArrowWrapperStyles,
                              ),
                            })}
                          >
                            <Icon glyph="CaretUp" />
                          </button>
                        )}
                      </Fragment>
                    ) : (
                      <button
                        {...getToggleButtonProps({
                          className: cx(
                            openAreaControlButtonStyles,
                            controlButtonStyles,
                          ),
                        })}
                        data-test-id="controlButton"
                      >
                        {hasDropdownTitle && (
                          <p className={menuTitleStyles}>{dropdownTitle}</p>
                        )}
                        <div className={currentValueStyles}>
                          {selectedItem && selectedItem.label}
                        </div>
                        <Icon
                          glyph="CaretUp"
                          className={controlButtonArrowStyles}
                        />
                      </button>
                    )}
                  </div>
                  <ul className={cx(menuStyles, optionListClassName)}>
                    {groups.map(group => (
                      <Fragment key={group.label}>
                        {group.label !== '' && (
                          <li className={menuGroupStyles}>{group.label}</li>
                        )}
                        {group.items.map(item => (
                          <li
                            key={getItemKey(item)}
                            {...getItemProps({
                              className: cx(menuItemStyles, {
                                [highlightedMenuItemStyles]:
                                  highlightedIndex === itemIndex++,
                                [selectedMenuItemStyles]: selectedItem === item,
                                [groupedMenuItemStyles]: group.label !== '',
                              }),
                              key: getItemKey(item),
                              item,
                            })}
                            data-value={item.value}
                          >
                            {item.label}
                          </li>
                        ))}
                      </Fragment>
                    ))}
                    {footer && (
                      // Catch any clicks that bubble up to the footer, and close the menu.
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                      <li
                        className={menuFooterStyles}
                        onClick={() => closeMenu()}
                      >
                        {footer}
                      </li>
                    )}
                  </ul>
                </div>
              </Popover>
              {isOpen && (
                <div className={spacingPlaceholderStyles} aria-hidden>
                  <div className={spacingPlaceholderValueStyles}>
                    {(selectedItem && selectedItem.label) || dropdownTitle}
                  </div>
                </div>
              )}
              {!isOpen && (
                // eslint-disable-next-line react/button-has-type
                <button
                  {...getToggleButtonProps({
                    ref: openButtonRef => {
                      this.openButtonRef = openButtonRef;
                    },
                    className: cx(controlButtonStyles, controlButtonClassName),
                    disabled,
                    title: String(title),
                  })}
                >
                  <div
                    className={cx(currentValueStyles, {
                      [currentValuePlaceholderStyles]:
                        !(selectedItem && selectedItem.label) &&
                        hasDropdownTitle,
                    })}
                  >
                    {(selectedItem && selectedItem.label) || dropdownTitle}
                  </div>
                  <Icon
                    glyph="CaretDown"
                    className={controlButtonArrowStyles}
                  />
                </button>
              )}
            </div>
          );
        }}
      </Downshift>
    );
  }
}

export default Select;
