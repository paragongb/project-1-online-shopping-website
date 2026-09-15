<template>
  <div class="admin-dashboard" v-if="isAdmin">
    <header class="admin-dashboard-header">
      <div>
        <span class="admin-dashboard-eyebrow">{{ t$('home.dashboard.eyebrow') }}</span>
        <h1>{{ t$('home.dashboard.title') }}</h1>
        <p>{{ t$('home.dashboard.subtitle') }}</p>
      </div>
      <div class="admin-dashboard-header-actions">
        <span class="admin-dashboard-updated" v-if="dashboard">
          {{ t$('home.dashboard.updated', { date: formatGeneratedAt(dashboard.generatedAt) }) }}
        </span>
        <div class="admin-dashboard-button-row">
          <button type="button" class="btn admin-dashboard-print" :disabled="isLoadingDashboard || !dashboard" @click="printDashboard">
            <font-awesome-icon icon="print"></font-awesome-icon>
            {{ t$('home.dashboard.print') }}
          </button>
          <button type="button" class="btn admin-dashboard-refresh" :disabled="isLoadingDashboard" @click="retrieveDashboard">
            <font-awesome-icon icon="sync" :spin="isLoadingDashboard"></font-awesome-icon>
            {{ t$('home.dashboard.refresh') }}
          </button>
        </div>
      </div>
    </header>

    <div class="admin-dashboard-loading" v-if="isLoadingDashboard && !dashboard">
      <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
    </div>

    <template v-else-if="dashboard">
      <section class="admin-dashboard-section">
        <div class="admin-dashboard-section-heading">
          <div>
            <h2>{{ t$('home.dashboard.overview.title') }}</h2>
            <p>{{ t$('home.dashboard.overview.subtitle') }}</p>
          </div>
        </div>
        <div class="admin-overview-grid">
          <article class="admin-stat-card admin-stat-card-primary">
            <span class="admin-stat-icon"><font-awesome-icon icon="tags"></font-awesome-icon></span>
            <div>
              <span class="admin-stat-label">{{ t$('home.dashboard.overview.revenue') }}</span
              ><strong>{{ formatCurrency(dashboard.overview.revenue) }}</strong>
            </div>
          </article>
          <article class="admin-stat-card">
            <span class="admin-stat-icon"><font-awesome-icon icon="receipt"></font-awesome-icon></span>
            <div>
              <span class="admin-stat-label">{{ t$('home.dashboard.overview.orders') }}</span
              ><strong>{{ formatNumber(dashboard.overview.orders) }}</strong>
            </div>
          </article>
          <article class="admin-stat-card">
            <span class="admin-stat-icon"><font-awesome-icon icon="shirt"></font-awesome-icon></span>
            <div>
              <span class="admin-stat-label">{{ t$('home.dashboard.overview.products') }}</span
              ><strong>{{ formatNumber(dashboard.overview.products) }}</strong>
            </div>
          </article>
          <article class="admin-stat-card">
            <span class="admin-stat-icon"><font-awesome-icon icon="users"></font-awesome-icon></span>
            <div>
              <span class="admin-stat-label">{{ t$('home.dashboard.overview.users') }}</span
              ><strong>{{ formatNumber(dashboard.overview.users) }}</strong>
            </div>
          </article>
          <article class="admin-stat-card">
            <span class="admin-stat-icon"><font-awesome-icon icon="star"></font-awesome-icon></span>
            <div>
              <span class="admin-stat-label">{{ t$('home.dashboard.overview.reviews') }}</span>
              <strong>{{ formatNumber(dashboard.overview.reviews) }}</strong>
              <small>{{ t$('home.dashboard.overview.averageRating', { rating: dashboard.overview.averageRating.toFixed(1) }) }}</small>
            </div>
          </article>
          <article class="admin-stat-card">
            <span class="admin-stat-icon"><font-awesome-icon icon="cart-shopping"></font-awesome-icon></span>
            <div>
              <span class="admin-stat-label">{{ t$('home.dashboard.overview.cartItems') }}</span
              ><strong>{{ formatNumber(dashboard.overview.cartItems) }}</strong>
            </div>
          </article>
          <article class="admin-stat-card">
            <span class="admin-stat-icon"><font-awesome-icon icon="heart"></font-awesome-icon></span>
            <div>
              <span class="admin-stat-label">{{ t$('home.dashboard.overview.wishlists') }}</span
              ><strong>{{ formatNumber(dashboard.overview.wishlists) }}</strong>
            </div>
          </article>
          <article class="admin-stat-card">
            <span class="admin-stat-icon"><font-awesome-icon icon="th-list"></font-awesome-icon></span>
            <div>
              <span class="admin-stat-label">{{ t$('home.dashboard.overview.categories') }}</span
              ><strong>{{ formatNumber(dashboard.overview.categories) }}</strong>
            </div>
          </article>
        </div>
      </section>

      <section class="admin-dashboard-section">
        <div class="admin-dashboard-section-heading">
          <div>
            <h2>{{ t$('home.dashboard.activity.title') }}</h2>
            <p>{{ t$('home.dashboard.activity.subtitle') }}</p>
          </div>
        </div>
        <div class="admin-period-grid">
          <article class="admin-period-card" v-for="period in dashboardPeriods" :key="period.key">
            <div class="admin-period-card-header">
              <span>{{ period.label }}</span>
              <font-awesome-icon icon="tachometer-alt"></font-awesome-icon>
            </div>
            <dl>
              <div>
                <dt>{{ t$('home.dashboard.activity.orders') }}</dt>
                <dd>{{ formatNumber(period.data.orders) }}</dd>
              </div>
              <div>
                <dt>{{ t$('home.dashboard.activity.revenue') }}</dt>
                <dd>{{ formatCurrency(period.data.revenue) }}</dd>
              </div>
              <div>
                <dt>{{ t$('home.dashboard.activity.newUsers') }}</dt>
                <dd>{{ formatNumber(period.data.newUsers) }}</dd>
              </div>
              <div>
                <dt>{{ t$('home.dashboard.activity.reviews') }}</dt>
                <dd>{{ formatNumber(period.data.reviews) }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <section class="admin-dashboard-section">
        <div class="admin-dashboard-section-heading">
          <div>
            <h2>{{ t$('home.dashboard.charts.title') }}</h2>
            <p>{{ t$('home.dashboard.charts.subtitle') }}</p>
          </div>
        </div>
        <div class="admin-chart-grid">
          <article class="admin-dashboard-panel admin-activity-chart-panel">
            <div class="admin-chart-heading">
              <div>
                <h3>{{ t$('home.dashboard.charts.activityTitle') }}</h3>
                <p>{{ t$('home.dashboard.charts.activitySubtitle') }}</p>
              </div>
              <div class="admin-chart-legend" aria-hidden="true">
                <span><i class="admin-chart-key admin-chart-key-orders"></i>{{ t$('home.dashboard.activity.orders') }}</span>
                <span><i class="admin-chart-key admin-chart-key-users"></i>{{ t$('home.dashboard.activity.newUsers') }}</span>
                <span><i class="admin-chart-key admin-chart-key-reviews"></i>{{ t$('home.dashboard.activity.reviews') }}</span>
              </div>
            </div>
            <div class="admin-activity-chart">
              <div class="admin-activity-group" v-for="period in dashboardPeriods" :key="`activity-${period.key}`">
                <div class="admin-activity-bars">
                  <div
                    class="admin-activity-bar admin-activity-bar-orders"
                    :style="{ height: chartPercent(period.data.orders, activityChartMax) }"
                    :title="`${period.label}: ${formatNumber(period.data.orders)} ${t$('home.dashboard.activity.orders')}`"
                  >
                    <span>{{ formatNumber(period.data.orders) }}</span>
                  </div>
                  <div
                    class="admin-activity-bar admin-activity-bar-users"
                    :style="{ height: chartPercent(period.data.newUsers, activityChartMax) }"
                    :title="`${period.label}: ${formatNumber(period.data.newUsers)} ${t$('home.dashboard.activity.newUsers')}`"
                  >
                    <span>{{ formatNumber(period.data.newUsers) }}</span>
                  </div>
                  <div
                    class="admin-activity-bar admin-activity-bar-reviews"
                    :style="{ height: chartPercent(period.data.reviews, activityChartMax) }"
                    :title="`${period.label}: ${formatNumber(period.data.reviews)} ${t$('home.dashboard.activity.reviews')}`"
                  >
                    <span>{{ formatNumber(period.data.reviews) }}</span>
                  </div>
                </div>
                <strong>{{ period.label }}</strong>
              </div>
            </div>
          </article>

          <article class="admin-dashboard-panel">
            <div class="admin-chart-heading">
              <div>
                <h3>{{ t$('home.dashboard.charts.revenueTitle') }}</h3>
                <p>{{ t$('home.dashboard.charts.revenueSubtitle') }}</p>
              </div>
            </div>
            <div class="admin-revenue-chart">
              <div class="admin-revenue-row" v-for="period in dashboardPeriods" :key="`revenue-${period.key}`">
                <div class="admin-revenue-label">
                  <span>{{ period.label }}</span>
                  <strong>{{ formatCurrency(period.data.revenue) }}</strong>
                </div>
                <div class="admin-horizontal-track">
                  <span :style="{ width: chartPercent(period.data.revenue, revenueChartMax, 2) }"></span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="admin-dashboard-panels">
        <article class="admin-dashboard-panel">
          <div class="admin-dashboard-section-heading">
            <div>
              <h2>{{ t$('home.dashboard.orders.title') }}</h2>
              <p>{{ t$('home.dashboard.orders.subtitle') }}</p>
            </div>
          </div>
          <div
            class="admin-order-distribution"
            role="img"
            :aria-label="t$('home.dashboard.orders.chartLabel', { total: orderStatusTotal })"
          >
            <span
              class="admin-order-segment admin-order-segment-pending"
              :style="{ width: chartPercent(dashboard.orderStatuses.pending, orderStatusTotal, 0) }"
            ></span>
            <span
              class="admin-order-segment admin-order-segment-paid"
              :style="{ width: chartPercent(dashboard.orderStatuses.paid, orderStatusTotal, 0) }"
            ></span>
            <span
              class="admin-order-segment admin-order-segment-processing"
              :style="{ width: chartPercent(dashboard.orderStatuses.processing, orderStatusTotal, 0) }"
            ></span>
            <span
              class="admin-order-segment admin-order-segment-shipped"
              :style="{ width: chartPercent(dashboard.orderStatuses.shipped, orderStatusTotal, 0) }"
            ></span>
            <span
              class="admin-order-segment admin-order-segment-delivered"
              :style="{ width: chartPercent(dashboard.orderStatuses.delivered, orderStatusTotal, 0) }"
            ></span>
            <span
              class="admin-order-segment admin-order-segment-cancelled"
              :style="{ width: chartPercent(dashboard.orderStatuses.cancelled, orderStatusTotal, 0) }"
            ></span>
          </div>
          <div class="admin-status-grid">
            <div class="admin-status-item admin-status-pending">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.PENDING') }}</span
              ><strong>{{ dashboard.orderStatuses.pending }}</strong>
            </div>
            <div class="admin-status-item admin-status-paid">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.PAID') }}</span
              ><strong>{{ dashboard.orderStatuses.paid }}</strong>
            </div>
            <div class="admin-status-item admin-status-processing">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.PROCESSING') }}</span
              ><strong>{{ dashboard.orderStatuses.processing }}</strong>
            </div>
            <div class="admin-status-item admin-status-shipped">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.SHIPPED') }}</span
              ><strong>{{ dashboard.orderStatuses.shipped }}</strong>
            </div>
            <div class="admin-status-item admin-status-delivered">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.DELIVERED') }}</span
              ><strong>{{ dashboard.orderStatuses.delivered }}</strong>
            </div>
            <div class="admin-status-item admin-status-cancelled">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.CANCELLED') }}</span
              ><strong>{{ dashboard.orderStatuses.cancelled }}</strong>
            </div>
          </div>
        </article>

        <article class="admin-dashboard-panel">
          <div class="admin-dashboard-section-heading">
            <div>
              <h2>{{ t$('home.dashboard.inventory.title') }}</h2>
              <p>{{ t$('home.dashboard.inventory.subtitle') }}</p>
            </div>
          </div>
          <dl class="admin-inventory-list">
            <div>
              <dt>
                <span><i class="admin-inventory-dot admin-inventory-in-stock"></i>{{ t$('home.dashboard.inventory.inStock') }}</span>
                <span class="admin-inventory-track"
                  ><i
                    class="admin-inventory-fill admin-inventory-in-stock"
                    :style="{ width: chartPercent(dashboard.catalog.inStock, inventoryChartMax, 2) }"
                  ></i
                ></span>
              </dt>
              <dd>{{ formatNumber(dashboard.catalog.inStock) }}</dd>
            </div>
            <div>
              <dt>
                <span><i class="admin-inventory-dot admin-inventory-low"></i>{{ t$('home.dashboard.inventory.lowStock') }}</span>
                <span class="admin-inventory-track"
                  ><i
                    class="admin-inventory-fill admin-inventory-low"
                    :style="{ width: chartPercent(dashboard.catalog.lowStock, inventoryChartMax, 2) }"
                  ></i
                ></span>
              </dt>
              <dd>{{ formatNumber(dashboard.catalog.lowStock) }}</dd>
            </div>
            <div>
              <dt>
                <span><i class="admin-inventory-dot admin-inventory-out"></i>{{ t$('home.dashboard.inventory.outOfStock') }}</span>
                <span class="admin-inventory-track"
                  ><i
                    class="admin-inventory-fill admin-inventory-out"
                    :style="{ width: chartPercent(dashboard.catalog.outOfStock, inventoryChartMax, 2) }"
                  ></i
                ></span>
              </dt>
              <dd>{{ formatNumber(dashboard.catalog.outOfStock) }}</dd>
            </div>
            <div>
              <dt>
                <span><i class="admin-inventory-dot admin-inventory-pre"></i>{{ t$('home.dashboard.inventory.preOrder') }}</span>
                <span class="admin-inventory-track"
                  ><i
                    class="admin-inventory-fill admin-inventory-pre"
                    :style="{ width: chartPercent(dashboard.catalog.preOrder, inventoryChartMax, 2) }"
                  ></i
                ></span>
              </dt>
              <dd>{{ formatNumber(dashboard.catalog.preOrder) }}</dd>
            </div>
          </dl>
        </article>
      </section>
    </template>

    <section class="admin-report" v-if="dashboard">
      <header class="admin-report-header">
        <div class="admin-report-brand">
          <span class="admin-report-mark">P1</span>
          <div>
            <strong>{{ t$('global.title') }}</strong>
            <span>{{ t$('home.dashboard.report.department') }}</span>
          </div>
        </div>
        <div class="admin-report-heading">
          <span>{{ t$('home.dashboard.report.eyebrow') }}</span>
          <h1>{{ t$('home.dashboard.report.title') }}</h1>
          <p>{{ t$('home.dashboard.report.subtitle') }}</p>
        </div>
        <dl class="admin-report-meta">
          <div>
            <dt>{{ t$('home.dashboard.report.generated') }}</dt>
            <dd>{{ formatGeneratedAt(dashboard.generatedAt) }}</dd>
          </div>
          <div>
            <dt>{{ t$('home.dashboard.report.scope') }}</dt>
            <dd>{{ t$('home.dashboard.report.scopeValue') }}</dd>
          </div>
        </dl>
      </header>

      <section class="admin-report-section">
        <div class="admin-report-section-title">
          <span>01</span>
          <div>
            <h2>{{ t$('home.dashboard.report.executiveTitle') }}</h2>
            <p>{{ t$('home.dashboard.report.executiveSubtitle') }}</p>
          </div>
        </div>
        <div class="admin-report-kpis">
          <article>
            <span>{{ t$('home.dashboard.overview.revenue') }}</span>
            <strong>{{ formatCurrency(dashboard.overview.revenue) }}</strong>
            <small>{{ t$('home.dashboard.report.excludesCancelled') }}</small>
          </article>
          <article>
            <span>{{ t$('home.dashboard.overview.orders') }}</span>
            <strong>{{ formatNumber(dashboard.overview.orders) }}</strong>
            <small>{{ t$('home.dashboard.report.allTime') }}</small>
          </article>
          <article>
            <span>{{ t$('home.dashboard.overview.users') }}</span>
            <strong>{{ formatNumber(dashboard.overview.users) }}</strong>
            <small>{{ t$('home.dashboard.report.registeredAccounts') }}</small>
          </article>
          <article>
            <span>{{ t$('home.dashboard.overview.products') }}</span>
            <strong>{{ formatNumber(dashboard.overview.products) }}</strong>
            <small>{{ t$('home.dashboard.report.categories', { count: dashboard.overview.categories }) }}</small>
          </article>
        </div>
      </section>

      <section class="admin-report-section">
        <div class="admin-report-section-title">
          <span>02</span>
          <div>
            <h2>{{ t$('home.dashboard.report.periodTitle') }}</h2>
            <p>{{ t$('home.dashboard.report.periodSubtitle') }}</p>
          </div>
        </div>
        <table class="admin-report-table admin-report-period-table">
          <thead>
            <tr>
              <th>{{ t$('home.dashboard.report.period') }}</th>
              <th>{{ t$('home.dashboard.activity.orders') }}</th>
              <th>{{ t$('home.dashboard.activity.revenue') }}</th>
              <th>{{ t$('home.dashboard.activity.newUsers') }}</th>
              <th>{{ t$('home.dashboard.activity.reviews') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="period in dashboardPeriods" :key="`report-${period.key}`">
              <th>{{ period.label }}</th>
              <td>{{ formatNumber(period.data.orders) }}</td>
              <td>{{ formatCurrency(period.data.revenue) }}</td>
              <td>{{ formatNumber(period.data.newUsers) }}</td>
              <td>{{ formatNumber(period.data.reviews) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="admin-report-analysis-grid">
        <article class="admin-report-section admin-report-analysis-card">
          <div class="admin-report-section-title">
            <span>03</span>
            <div>
              <h2>{{ t$('home.dashboard.report.operationsTitle') }}</h2>
              <p>{{ t$('home.dashboard.report.operationsSubtitle') }}</p>
            </div>
          </div>
          <div class="admin-report-operations">
            <div>
              <span>{{ t$('home.dashboard.report.activeOrders') }}</span>
              <strong>{{ formatNumber(activeOrderTotal) }}</strong>
            </div>
            <div>
              <span>{{ t$('home.dashboard.report.deliveredShare') }}</span>
              <strong>{{ formatPercentage(dashboard.orderStatuses.delivered, orderStatusTotal) }}</strong>
            </div>
            <div>
              <span>{{ t$('home.dashboard.report.inventoryAttention') }}</span>
              <strong>{{ formatNumber(inventoryAttentionTotal) }}</strong>
            </div>
            <div>
              <span>{{ t$('home.dashboard.report.customerRating') }}</span>
              <strong>{{ dashboard.overview.averageRating.toFixed(1) }} / 5</strong>
            </div>
          </div>
        </article>

        <article class="admin-report-section admin-report-analysis-card">
          <div class="admin-report-section-title">
            <span>04</span>
            <div>
              <h2>{{ t$('home.dashboard.report.engagementTitle') }}</h2>
              <p>{{ t$('home.dashboard.report.engagementSubtitle') }}</p>
            </div>
          </div>
          <div class="admin-report-operations">
            <div>
              <span>{{ t$('home.dashboard.overview.reviews') }}</span>
              <strong>{{ formatNumber(dashboard.overview.reviews) }}</strong>
            </div>
            <div>
              <span>{{ t$('home.dashboard.overview.wishlists') }}</span>
              <strong>{{ formatNumber(dashboard.overview.wishlists) }}</strong>
            </div>
            <div>
              <span>{{ t$('home.dashboard.overview.cartItems') }}</span>
              <strong>{{ formatNumber(dashboard.overview.cartItems) }}</strong>
            </div>
            <div>
              <span>{{ t$('home.dashboard.report.monthlyUsers') }}</span>
              <strong>{{ formatNumber(dashboard.month.newUsers) }}</strong>
            </div>
          </div>
        </article>
      </section>

      <section class="admin-report-detail-grid">
        <article class="admin-report-section">
          <div class="admin-report-section-title admin-report-section-title-compact">
            <span>05</span>
            <div>
              <h2>{{ t$('home.dashboard.report.orderBreakdown') }}</h2>
            </div>
          </div>
          <div class="admin-report-breakdown">
            <div>
              <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.PENDING') }}</span>
              <i><b :style="{ width: chartPercent(dashboard.orderStatuses.pending, orderStatusTotal, 0) }"></b></i>
              <strong>{{ dashboard.orderStatuses.pending }}</strong>
            </div>
            <div>
              <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.PAID') }}</span>
              <i><b :style="{ width: chartPercent(dashboard.orderStatuses.paid, orderStatusTotal, 0) }"></b></i>
              <strong>{{ dashboard.orderStatuses.paid }}</strong>
            </div>
            <div>
              <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.PROCESSING') }}</span>
              <i><b :style="{ width: chartPercent(dashboard.orderStatuses.processing, orderStatusTotal, 0) }"></b></i>
              <strong>{{ dashboard.orderStatuses.processing }}</strong>
            </div>
            <div>
              <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.SHIPPED') }}</span>
              <i><b :style="{ width: chartPercent(dashboard.orderStatuses.shipped, orderStatusTotal, 0) }"></b></i>
              <strong>{{ dashboard.orderStatuses.shipped }}</strong>
            </div>
            <div>
              <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.DELIVERED') }}</span>
              <i><b :style="{ width: chartPercent(dashboard.orderStatuses.delivered, orderStatusTotal, 0) }"></b></i>
              <strong>{{ dashboard.orderStatuses.delivered }}</strong>
            </div>
            <div>
              <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.CANCELLED') }}</span>
              <i><b :style="{ width: chartPercent(dashboard.orderStatuses.cancelled, orderStatusTotal, 0) }"></b></i>
              <strong>{{ dashboard.orderStatuses.cancelled }}</strong>
            </div>
          </div>
        </article>

        <article class="admin-report-section">
          <div class="admin-report-section-title admin-report-section-title-compact">
            <span>06</span>
            <div>
              <h2>{{ t$('home.dashboard.report.inventoryBreakdown') }}</h2>
            </div>
          </div>
          <table class="admin-report-table admin-report-inventory-table">
            <tbody>
              <tr>
                <th>{{ t$('home.dashboard.inventory.inStock') }}</th>
                <td>{{ formatNumber(dashboard.catalog.inStock) }}</td>
              </tr>
              <tr>
                <th>{{ t$('home.dashboard.inventory.lowStock') }}</th>
                <td>{{ formatNumber(dashboard.catalog.lowStock) }}</td>
              </tr>
              <tr>
                <th>{{ t$('home.dashboard.inventory.outOfStock') }}</th>
                <td>{{ formatNumber(dashboard.catalog.outOfStock) }}</td>
              </tr>
              <tr>
                <th>{{ t$('home.dashboard.inventory.preOrder') }}</th>
                <td>{{ formatNumber(dashboard.catalog.preOrder) }}</td>
              </tr>
            </tbody>
          </table>
        </article>
      </section>

      <footer class="admin-report-footer">
        <span>{{ t$('home.dashboard.report.footer') }}</span>
        <span>{{ t$('home.dashboard.report.generatedBy') }}</span>
      </footer>
    </section>
  </div>

  <div class="landing-page" v-else>
    <section class="landing-hero">
      <div class="landing-hero-text">
        <span class="landing-hero-eyebrow">{{ t$('home.landing.eyebrow') }}</span>
        <h1 class="landing-hero-title">{{ t$('home.landing.title') }}</h1>
        <p class="landing-hero-subtitle">{{ t$('home.landing.subtitle') }}</p>
        <div class="landing-hero-actions">
          <router-link :to="{ name: 'Product' }" class="btn landing-btn-primary">
            {{ t$('home.landing.shopNow') }}
          </router-link>
          <a href="#landing-categories" class="btn landing-btn-secondary">
            {{ t$('home.landing.browseCategories') }}
          </a>
        </div>
      </div>
      <div class="landing-hero-visual">
        <font-awesome-icon icon="shirt"></font-awesome-icon>
      </div>
    </section>

    <section class="landing-trust">
      <div class="landing-trust-item">
        <font-awesome-icon icon="truck-fast"></font-awesome-icon>
        <span>{{ t$('home.landing.trust.shipping') }}</span>
      </div>
      <div class="landing-trust-item">
        <font-awesome-icon icon="shield-halved"></font-awesome-icon>
        <span>{{ t$('home.landing.trust.payment') }}</span>
      </div>
      <div class="landing-trust-item">
        <font-awesome-icon icon="arrows-rotate"></font-awesome-icon>
        <span>{{ t$('home.landing.trust.returns') }}</span>
      </div>
      <div class="landing-trust-item">
        <font-awesome-icon icon="tags"></font-awesome-icon>
        <span>{{ t$('home.landing.trust.pricing') }}</span>
      </div>
    </section>

    <section id="landing-categories" class="landing-section" v-if="categories.length > 0">
      <h2 class="landing-section-title">{{ t$('home.landing.categoriesTitle') }}</h2>
      <div class="landing-categories">
        <router-link :to="{ name: 'Product' }" class="landing-category-card" v-for="category in categories" :key="category.id">
          <font-awesome-icon icon="shirt"></font-awesome-icon>
          <span>{{ category.name }}</span>
        </router-link>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-section-header">
        <h2 class="landing-section-title">{{ t$('home.landing.featuredTitle') }}</h2>
        <router-link :to="{ name: 'Product' }" class="landing-view-all">{{ t$('home.landing.viewAll') }}</router-link>
      </div>

      <div class="landing-loading" v-if="isLoadingHome">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div class="landing-products" v-else>
        <div class="landing-product-card" v-for="product in featuredProducts" :key="product.id">
          <router-link :to="{ name: 'Product' }" class="landing-product-media">
            <img v-if="product.image" :src="'data:' + product.imageContentType + ';base64,' + product.image" :alt="product.name" />
            <div v-else class="landing-product-media-placeholder">
              <font-awesome-icon icon="shirt"></font-awesome-icon>
            </div>
          </router-link>
          <div class="landing-product-body">
            <span class="landing-product-name">{{ product.name }}</span>
            <div class="landing-product-footer">
              <span class="landing-product-price">{{ '$' + product.price }}</span>
              <button
                type="button"
                class="landing-btn-add-cart"
                :disabled="product.status === 'OUT_OF_STOCK' || addingToCartId === product.id"
                @click="addToCart(product)"
              >
                <font-awesome-icon icon="cart-plus"></font-awesome-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-cta">
      <h2>{{ t$('home.landing.ctaTitle') }}</h2>
      <p>{{ t$('home.landing.ctaSubtitle') }}</p>
      <router-link :to="{ name: 'Product' }" class="btn landing-btn-primary">
        {{ t$('home.landing.shopNow') }}
      </router-link>
    </section>
  </div>
</template>

<script lang="ts" src="./home.component.ts"></script>
<style lang="scss" src="./home.scss"></style>
