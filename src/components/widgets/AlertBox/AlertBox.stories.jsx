import React from 'react';
import AlertBox from './AlertBox';

export default {
  component: AlertBox,
  title: 'AlertBox',
  argTypes: {
    severity: {
      control: { type: 'select' },
      options: ['success', 'error', 'warning', 'info'], // Define available severity options
    },
  },
  tags: ['autodocs'],
  message: { control: 'text' },
};

const Template = (args) => <AlertBox {...args} />;

export const Default = Template.bind({});
Default.args = {
  severity: 'success',
  message: 'Test Success message',
};
