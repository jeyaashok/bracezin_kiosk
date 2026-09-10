# Theme Design System Adoption Checklist

## Project Structure & Architecture
- [ ] Implement feature-based lazy loading in `app-routing.module.ts`
- [ ] Create folder structure: `src/app/core/` (services, guards, interceptors)
- [ ] Create folder structure: `src/app/shared/` (components, directives, pipes)
- [ ] Create folder structure: `src/app/store/` (NgRx state management)
- [ ] Verify all feature modules (products, orders, etc.) use lazy loading

## NgRx Store Setup
- [ ] Install NgRx dependencies: @ngrx/store, @ngrx/effects, @ngrx/store-devtools
- [ ] Create root reducer combining all feature reducers
- [ ] Setup StoreModule and EffectsModule in app.module.ts
- [ ] Create feature store for Products (actions, reducer, effects, selectors)
- [ ] Create feature store for Orders
- [ ] Create feature store for Customers
- [ ] Create store for layouts (dynamic layout switching)
- [ ] Test store DevTools in browser (Redux DevTools)

## Services Layer
- [ ] Create `core/services/rest-api.service.ts` with base HTTP methods
- [ ] Create `core/services/authentication.service.ts` with login/register
- [ ] Create `core/services/pagination.service.ts` for sorting & pagination
- [ ] Create `core/services/language.service.ts` for i18n support
- [ ] Create `core/services/event.service.ts` for cross-component communication
- [ ] Implement JWT token storage and retrieval

## HTTP Interceptors
- [ ] Create `core/interceptors/jwt.interceptor.ts` (add Authorization header)
- [ ] Create `core/interceptors/error.interceptor.ts` (global error handling)
- [ ] Register interceptors in app.module.ts HTTP_INTERCEPTORS

## Authentication & Guards
- [ ] Create `core/guards/auth.guard.ts` to protect authenticated routes
- [ ] Implement canActivate to check sessionStorage for currentUser
- [ ] Setup authentication state in store
- [ ] Create login/register pages using feature module

## Shared Module
- [ ] Create `shared/shared.module.ts` with common imports/exports
- [ ] Create `shared/components/breadcrumbs/` component
- [ ] Create reusable UI components (widgets, cards, forms)
- [ ] Export all components in SharedModule
- [ ] Import SharedModule in all feature modules

## Styling System
- [ ] Install Bootstrap 5.3.8 via npm
- [ ] Import Bootstrap in styles.scss
- [ ] Create SCSS variables in `assets/scss/variables/`
- [ ] Create SCSS mixins in `assets/scss/mixins/`
- [ ] Create global utilities in `assets/scss/utilities/`
- [ ] Setup Tailwind config (if using Tailwind)
- [ ] Configure component SCSS in angular.json

## Layout System
- [ ] Create `layouts/layout.component.ts` with dynamic layout switching
- [ ] Create vertical layout component
- [ ] Create horizontal layout component
- [ ] Create two-column layout component
- [ ] Implement data attributes on document.documentElement for theming
- [ ] Create layout store/state management
- [ ] Support dark mode via CSS classes

## UI Library Integration
- [ ] Install @ng-bootstrap/ng-bootstrap
- [ ] Import NgbModule in shared/feature modules
- [ ] Install ng-select for searchable dropdowns
- [ ] Install ngx-slick-carousel for carousels
- [ ] Install ng2-charts for chart components
- [ ] Install ngx-lightbox for image galleries
- [ ] Install @fullcalendar/angular for calendars
- [ ] Install @ckeditor/ckeditor5-angular for rich text editors
- [ ] Install simplebar-angular for custom scrollbars
- [ ] Install lodash and @types/lodash for utilities

## Page Components
- [ ] Update products page with store integration
- [ ] Implement filter card + table layout pattern
- [ ] Add breadcrumbs to all pages
- [ ] Use mat-table with MatSort for sortable tables
- [ ] Use MatPaginator for pagination
- [ ] Implement action buttons (edit, delete, more menu)
- [ ] Use NgbModal for dialogs
- [ ] Add loading states and error handling

## Forms
- [ ] Use ReactiveFormsModule throughout
- [ ] Implement form validation
- [ ] Create form templates in modals
- [ ] Add FormArray support for dynamic fields
- [ ] Implement submit, cancel, reset functionality

## Icons & Assets
- [ ] Setup Feather icons integration
- [ ] Setup Material icons
- [ ] Upload logo and branding images to assets/images/
- [ ] Setup language files in assets/i18n/ (en.json, ar.json, etc.)

## Configuration
- [ ] Create `global-component.ts` with API endpoints
- [ ] Setup environment.ts for development
- [ ] Setup environment.prod.ts for production
- [ ] Configure API base URL
- [ ] Setup JWT token header configuration

## Internationalization (i18n)
- [ ] Install @ngx-translate/core and @ngx-translate/http-loader
- [ ] Configure TranslateModule in app.module
- [ ] Create translation files (en.json, ar.json, etc.)
- [ ] Implement language switching service
- [ ] Add language selector in layout

## Accessibility
- [ ] Add aria-label to all buttons
- [ ] Add matTooltip for button hints
- [ ] Use proper heading hierarchy
- [ ] Add alt text to images
- [ ] Test keyboard navigation

## Performance
- [ ] Implement lazy loading for all feature modules
- [ ] Optimize change detection (OnPush strategy where possible)
- [ ] Use memoized selectors from store
- [ ] Implement virtual scrolling for large lists
- [ ] Optimize bundle size with tree-shaking

## Testing
- [ ] Setup Jasmine/Karma test configuration
- [ ] Create component unit tests
- [ ] Create service unit tests
- [ ] Create store unit tests (reducers, actions, effects)
- [ ] Setup E2E tests with Protractor/Cypress

## Documentation
- [ ] Document component usage in comments
- [ ] Create README for each feature module
- [ ] Document API contract and models
- [ ] Create guide for adding new features
- [ ] Document store structure and selectors

## Deployment
- [ ] Configure production build in angular.json
- [ ] Setup environment-based configurations
- [ ] Test production build locally
- [ ] Configure CI/CD pipeline
- [ ] Setup error monitoring (Sentry/similar)

## Quality Assurance
- [ ] Run ESLint checks
- [ ] Fix TypeScript strict mode violations
- [ ] Run application in production mode
- [ ] Test all major user flows
- [ ] Performance testing with Lighthouse
- [ ] Cross-browser testing

## Browser & Environment
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test dark mode functionality
- [ ] Test RTL layout (Arabic, etc.)
- [ ] Verify responsive design on all breakpoints

## Final Checks
- [ ] Code review of all major components
- [ ] Security review (no hardcoded secrets)
- [ ] Remove console.log statements
- [ ] Update package.json scripts
- [ ] Verify all dependencies are up to date
- [ ] Create CHANGELOG
