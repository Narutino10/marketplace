// import { mount } from '@vue/test-utils';
// import AddOrderForm from '../components/AddOrderForm.vue';

// describe('AddOrderForm.vue', () => {
//   it('should render the component', () => {
//     const wrapper = mount(AddOrderForm);
//     expect(wrapper.exists()).toBe(true);
//   });

//   it('should submit the form with correct data', async () => {
//     const wrapper = mount(AddOrderForm);

//     // Remplir les champs du formulaire
//     await wrapper.find('input[name="product"]').setValue('Test Product');
//     await wrapper.find('input[name="quantity"]').setValue(2);

//     // Soumettre le formulaire
//     await wrapper.find('form').trigger('submit.prevent');

//     // Vérifier que l'événement de soumission est émis avec les bonnes données
//     expect(wrapper.emitted().submit[0]).toEqual([{ product: 'Test Product', quantity: 2 }]);
//   });
// });
