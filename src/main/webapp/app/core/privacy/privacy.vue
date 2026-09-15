<template>
  <main class="privacy-page" aria-labelledby="privacy-title">
    <header class="privacy-hero">
      <span class="privacy-eyebrow">Your information</span>
      <h1 id="privacy-title">Privacy notice</h1>
      <p>We only use the information needed to manage your account, wishlist, orders, reviews, and delivery.</p>
    </header>

    <div class="privacy-grid">
      <section class="privacy-card">
        <h2>Information we store</h2>
        <p>
          Your account details, saved delivery addresses, order history, wishlist items, and reviews are stored for your shopping
          experience.
        </p>
      </section>
      <section class="privacy-card">
        <h2>How it is used</h2>
        <p>Your address is used to arrange delivery. Order and review information is used to manage purchases and display feedback.</p>
      </section>
      <section class="privacy-card">
        <h2>Who can see it</h2>
        <p>
          Your private cart, wishlist, addresses, and order history are limited to your account. Administrators can access operational
          records when needed.
        </p>
      </section>
      <section class="privacy-card">
        <h2>Your choices</h2>
        <p>
          You can update your account details and saved delivery information. Contact the store administrator if you need help with your
          stored data.
        </p>
      </section>
    </div>

    <div class="privacy-actions">
      <router-link :to="{ name: 'Home' }" class="btn privacy-home-button">
        <font-awesome-icon icon="home"></font-awesome-icon>
        Return home
      </router-link>
    </div>
  </main>
</template>

<style lang="scss" src="./privacy.scss"></style>
