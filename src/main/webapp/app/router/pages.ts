const Privacy = () => import('@/core/privacy/privacy.vue');

// jhipster-needle-add-entity-to-router-import - JHipster will import entities to the router here

export default [
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
  },
  // jhipster-needle-add-entity-to-router - JHipster will add entities to the router here
];
