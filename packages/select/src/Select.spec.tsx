import React from 'react';
import {
  render,
  cleanup,
  getByTestId,
  fireEvent,
  findByRole,
  findAllByRole,
} from '@testing-library/react';
import { typeIs } from '@leafygreen-ui/lib';
import Select from './Select';

afterAll(cleanup);

describe('packages/Select', function() {
  describe('when rendered without an initial value', function() {
    const { container } = render(
      <Select<string, string>
        value={null}
        options={[
          { label: 'Other', value: 'other' },
          { label: 'Test', value: 'testval' },
        ]}
      />,
    );

    const controlButton = getByTestId(container, 'controlButton');

    it('renders an empty current value', function() {
      expect(controlButton.textContent).toEqual('');
    });
  });

  describe('when rendered with a given value matching one of its options', function() {
    const options = [
      { label: 'Other', value: 'other' },
      { label: 'Test', value: 'testval' },
    ];
    const onChange = jest.fn();
    const { container } = render(
      <Select value="testval" onChange={onChange} options={options} />,
    );

    const controlButton = getByTestId(container, 'controlButton');

    it('renders the label of the selected item', function() {
      expect(controlButton.textContent).toEqual('Test');
    });

    describe('and the current value is clicked', function() {
      fireEvent.click(controlButton);

      const menuItemsPromise = findAllByRole(container, 'option');

      it('renders a menu with all of the options', async function() {
        expect((await menuItemsPromise).length).toEqual(options.length);
      });

      it('does not render a group', function() {
        expect(this.wrapper.find('.select-menu-group').length).to.equal(0);
      });

      it('adds the selected class to the value corresponding to the given value', function() {
        expect(this.wrapper.find('.select-menu-item').at(1)).to.have.className(
          'select-menu-item-is-selected',
        );
      });

      it('does not render an input (searchable defaults to false)', function() {
        expect(this.wrapper.find('.select-input').length).to.equal(0);
      });

      describe('and a non-selected row is clicked', function() {
        beforeEach(function() {
          this.wrapper
            .find('.select-menu-item')
            .at(0)
            .simulate('click');
        });

        it('closes the menu', function() {
          expect(this.wrapper.find('.select-menu').length).to.equal(0);
        });

        it("calls onChange with the clicked row's value", function() {
          expect(this.onChange).to.have.been.calledWith('other');
        });

        it('does not change its displayed label (with onChange not changing anything)', function() {
          expect(
            this.wrapper.find('.select-control-button-current-value'),
          ).to.have.text('Test');
        });
      });
    });

    describe('and a different value is given to it', function() {
      beforeEach(function() {
        this.wrapper.setProps({ value: 'other' });
      });

      it('changes the displayed label', function() {
        expect(
          this.wrapper.find('.select-control-button-current-value'),
        ).to.have.text('Other');
      });
    });
  });

  describe('with searchable set to true', function() {
    beforeEach(function() {
      this.options = [
        { label: 'OTHER', value: 'other' },
        { label: 'Test', value: 'testval' },
        { label: 'Third', value: '3' },
      ];
      this.onChange = this.sandbox.stub();
      this.wrapper = enzyme.mount(
        <Select<string, string>
          value="testval"
          onChange={this.onChange}
          options={this.options}
          itemToString={item => (item == null ? '' : item.label)}
          searchable
        />,
      );

      // There's no difference before the menu is opened, so we don't need another describe block.
      this.wrapper
        .find('.select-control-button-current-value')
        .simulate('click');
    });

    // NOTE(JeT):
    // itemToDisplayString is made available for cases where itemToString is not acceptable for the placeholder.
    it('uses the result of itemToString as the input placeholder', function() {
      expect(this.wrapper.find('.select-input')).to.have.props({
        placeholder: 'Test',
      });
    });

    it('has a blank input', function() {
      expect(this.wrapper.find('.select-input')).to.have.props({ value: '' });
    });

    it('focuses the input', function() {
      expect(this.wrapper.find('.select-input').getDOMNode()).to.equal(
        document.activeElement,
      );
    });

    describe('with a value entered into the filter input', function() {
      beforeEach(function() {
        this.wrapper
          .find('.select-input')
          .simulate('change', { target: { value: 'e' } });
      });

      it('hides values that do not match the input in their itemToString results (case-insensitive)', function() {
        expect(
          this.wrapper.find('.select-menu-item').map(node => node.text()),
        ).to.deep.equal(['OTHER', 'Test']);
      });
    });
  });

  describe('with a footer', function() {
    beforeEach(function() {
      this.wrapper = enzyme.mount(
        <Select
          value={null}
          options={[]}
          footer={<div className="test-footer" />}
        />,
      );
      this.wrapper
        .find('.select-control-button-current-value')
        .simulate('click');
    });

    it('renders the footer in the menu', function() {
      expect(this.wrapper.find('.select-menu .test-footer')).to.be.present;
    });
  });

  describe('when the dropdown has its input blurred', function() {
    beforeEach(function() {
      this.selectEl = (
        <Select
          options={[{ label: 'blah', value: 'blah' }]}
          value="blah"
          searchable
        />
      );
      this.wrapper = enzyme.mount(this.selectEl);
    });

    describe('with a simple blur event', function() {
      beforeEach(function(done) {
        this.wrapper
          .find('.select-control-button-current-value')
          .simulate('click');
        this.wrapper.find('input').simulate('blur');

        // Need to wait for Downshift to update before we can proceed.
        // Due to https://github.com/paypal/downshift/pull/374
        setTimeout(() => {
          this.wrapper.update();
          done();
        });
      });

      it('closes the dropdown', function() {
        expect(this.wrapper.find('.select-menu').length).to.equal(0);
      });

      it('focuses the current value button element', function() {
        expect(
          this.wrapper.find('.select-control-button').getDOMNode(),
        ).to.equal(document.activeElement);
      });
    });

    describe('by focusing on another input', function() {
      beforeEach(function(done) {
        this.wrapper = enzyme.mount(
          <div>
            {this.selectEl}
            <input className="test-input" />
          </div>,
        );
        this.wrapper
          .find('.select-control-button-current-value')
          .simulate('click');
        this.wrapper.find('.test-input').simulate('focus');

        setTimeout(() => {
          this.wrapper.update();
          done();
        });
      });

      // NOTE(hswolff): I can't get this test to work for some reason. Skipping it for now.
      it.skip('closes the dropdown', function() {
        expect(this.wrapper.find('.select-menu').length).to.equal(0);
      });

      // NOTE(JeT): I can't get this test to work for some reason. Skipping it for now.
      it.skip('does not steal the focus away from the other input', function() {
        expect(this.wrapper.find('.test-input').getDOMNode()).to.equal(
          document.activeElement,
        );
      });
    });
  });

  describe('when rendered with a groupBy for optgroup behavior', function() {
    beforeEach(function() {
      this.options = [
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' },
        { label: 'B1', value: 'b1' },
      ];
      this.onChange = this.sandbox.stub();
      this.wrapper = enzyme.mount(
        <Select<string, string>
          value="a"
          onChange={this.onChange}
          options={this.options}
          groupBy={({ label }) => `Starts with ${label[0]}`}
        />,
      );
    });

    it('renders the label of the selected item', function() {
      expect(
        this.wrapper.find('.select-control-button-current-value'),
      ).to.have.text('A');
    });

    describe('and the current value is clicked', function() {
      beforeEach(function() {
        this.wrapper
          .find('.select-control-button-current-value')
          .simulate('click');
      });

      it('renders a menu with all of the options', function() {
        expect(this.wrapper.find('.select-menu-item').length).to.equal(
          this.options.length,
        );
      });

      it('does not render a group', function() {
        expect(this.wrapper.find('.select-menu-group').length).to.equal(2);
      });

      describe('and a non-selected row is clicked', function() {
        beforeEach(function() {
          this.wrapper
            .find('.select-menu-item')
            .at(1)
            .simulate('click');
        });

        it('closes the menu', function() {
          expect(this.wrapper.find('.select-menu').length).to.equal(0);
        });

        it("calls onChange with the clicked row's value", function() {
          expect(this.onChange).to.have.been.calledWith('b');
        });

        it('does not change its displayed label (with onChange not changing anything)', function() {
          expect(
            this.wrapper.find('.select-control-button-current-value'),
          ).to.have.text('A');
        });
      });
    });
  });
});
