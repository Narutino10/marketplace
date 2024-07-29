import { mount } from '@vue/test-utils';
import AuthModal from '../src/components/common/AuthModal.vue';

describe('AuthModal.vue', () => {
  it('should render the component', () => {
    const wrapper = mount(AuthModal);
    expect(wrapper.exists()).toBe(true);
  });

  it('should show login form when login button is clicked', async () => {
    const wrapper = mount(AuthModal);
    await wrapper.find('button.login-button').trigger('click');
    expect(wrapper.find('form.login-form').exists()).toBe(true);
  });

  it('should show registration form when register button is clicked', async () => {
    const wrapper = mount(AuthModal);
    await wrapper.find('button.register-button').trigger('click');
    expect(wrapper.find('form.register-form').exists()).toBe(true);
  });
});
