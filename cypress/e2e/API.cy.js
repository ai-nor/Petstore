import { faker } from '@faker-js/faker';
import * as pet from '../fixtures/pet.json'
import * as petUpdate from '../fixtures/petUpdate.json'

pet.id = parseInt(faker.random.numeric(5));
pet.name = faker.animal.crocodilia.name;
pet.category.id = parseInt(faker.random.numeric(3));
pet.category.name = faker.animal.type();

let petId;
let petUpdateId;
let petStatus;
let petName;

describe('Petstore tests', () => {


  it('Pet creation', () => {
    cy.request('POST', '/pet', pet).then (response =>{
      console.log(response.allRequestResponses[0]["Request Body"]);

      // cy.log(`Request body: ${response.allRequestResponses[0]["Request Body"]}`);   //подивитися значення респонсу 
      // cy.log(`Request headers:  ${JSON.stringify(response.allRequestResponses[0]["Request Headers"])}`);
      // cy.log(`Request Url:  ${JSON.stringify(response.allRequestResponses[0]["Request URL"])}`);

      expect (response.status).to.be.equal(200);
      expect (response.statusText).to.be.equal('OK');
      expect (response.isOkStatusCode).to.be.true;

      expect(response.body.id).to.be.equal(pet.id);
      expect (response.body.name).to.be.equal(pet.name);
      expect (response.body.category.id).to.be.equal(pet.category.id);
      expect (response.body.category.name).to.be.equal(pet.category.name);

      petId = response.body.id;

    })
  })

  it('Pet get by id', () => {
    cy.request('GET', `/pet/${petId}`).then (response =>{
      console.log(response.allRequestResponses[0]["Request Body"]);

      expect (response.status).to.be.equal(200);
      expect(response.body.id).to.be.equal(petId);
      

    })
  })

  it('Pet update', () => {
    petUpdate.id = petId;
    cy.request('PUT', '/pet', petUpdate).then (response =>{
      console.log(response.allRequestResponses[0]["Request Body"]);

      expect (response.statusText).to.be.equal('OK');

      expect(response.body.id).to.be.equal(pet.id);
      expect (response.body.name).to.be.equal(petUpdate.name);
      expect (response.body.category.name).to.be.equal(petUpdate.category.name);

      petId = response.body.id;

    })
  })

  it('Update pet by id with form-data', () => {

      cy.request({
        method: 'POST',
        url: `/pet/${petId}`, 
        form: true, 
        body: {
          name: 'Murzik',
          status: 'Sold',
        },
      }).then (response =>{
        console.log(response.allRequestResponses[0]["Request Body"]);

      expect (response.status).to.be.equal(200);
      expect (response.body.message).to.be.equal(`${petId}`);
    })

      cy.request('GET', `/pet/${petId}`).then (response =>{
        console.log(response.allRequestResponses[0]["Request Body"]);
  
        expect (response.status).to.be.equal(200);
        expect(response.body.id).to.be.equal(petId);
        expect(response.body.name).to.be.equal('Murzik');
        expect (response.body.status).to.be.equal('Sold');
        petStatus = response.body.status;
        petName = response.body.name;
    
  })
})

it('Find pet by status', () => {

  cy.request({
    method: 'GET',
    url: `/pet/findByStatus?status=${petStatus}`
  }).then (response =>{
    console.log(response.allRequestResponses[0]["Request Body"]);

    expect (response.status).to.be.equal(200);
    for (let i = 0; i<response.length; i++) {
      if (response[i].body.id=petId) {
        expect (response.body.name).to.be.equal(`${petName}`);
        expect(response.body.status).to.be.equal(`${petStatus}`);
      }
   }
    
})
})

it(`Delete pet with id ${pet.id}`, () => {

  cy.request({
    method: 'DELETE',
    url: `/pet/${petId}`,
  }).then (response =>{
    console.log(response.allRequestResponses[0]["Request Body"]);

  expect (response.status).to.be.equal(200);
  expect (response.body.message).to.be.equal(`${petId}`);
})
  cy.request({
    method: 'GET',
    url: `/pet/${petId}`,
  failOnStatusCode: false
}).then (response =>{
    console.log(response.allRequestResponses[0]["Request Body"]);

    expect (response.status).to.be.equal(404);
    expect (response.body.message).to.be.equal('Pet not found');

})
})
})

