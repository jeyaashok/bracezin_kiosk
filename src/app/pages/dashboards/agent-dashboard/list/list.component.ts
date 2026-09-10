import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: false
})
@UntilDestroy()

export class ListComponent implements OnInit {

  breadCrumbItems!: Array<{}>;

  customer: any;

  statData: any;

  mainAddress: any;
  deliveryAddresses: any[] = [];

  orderHistory: any[] = [];

  productsPurchased: any[] = [];

  outstandingInvoices: any[] = [];

  recentActivities: any[] = [];

  // used by the add-address offcanvas form
  addressForm: any = {
    label: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  };

  constructor(private offcanvasService: NgbOffcanvas) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Customers' },
      { label: 'Customer Dashboard', active: true }
    ];

    this._initCustomer();
    this._initStatShell();
    this._initAddresses();
    this._initOrderHistory();
    this._initProductsPurchased();
    this._initOutstandingInvoices();
    this._initRecentActivities();
  }

  private _initCustomer() {
    this.customer = {
      id: 'CUST-1042',
      name: 'Bracezin Enterprises',
      contact_person: 'Bracezin Technologies',
      email: 'bracezin@bracezintechnologies.in',
      phone: '+91 9999 01010',
      customer_since: '12 Mar 2023',
      gst_number: '27AAECV1234F1Z5'
    };
  }

  private _initStatShell() {
    this.statData = [
      { title: 'Total Orders', value: 34, persantage: 12, profit: 'up', subtext: 'vs last quarter', icon: 'ri-shopping-cart-2-line', icon_bg_color: 'primary' },
      { title: 'Outstanding Amount', value: '₹1.85L', persantage: null, profit: 'attention', subtext: '3 Invoices Overdue', icon: 'ri-file-warning-line', icon_bg_color: 'danger' },
      { title: 'Total Spent (Lifetime)', value: '₹18.6L', persantage: 8, profit: 'up', subtext: 'vs last year', icon: 'ri-money-rupee-circle-line', icon_bg_color: 'success' },
      { title: 'Products Purchased', value: 21, persantage: null, profit: 'neutral', subtext: 'Unique Products', icon: 'ri-box-3-line', icon_bg_color: 'purple' }
    ];
  }

  private _initAddresses() {
    this.mainAddress = {
      id: 'ADDR-001',
      label: 'Head Office',
      line1: '14, Industrial Estate Road',
      line2: 'Near GIDC',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380015',
      phone: '+91 98765 43210',
      is_main: true
    };

    this.deliveryAddresses = [
      {
        id: 'ADDR-002',
        label: 'Warehouse - Vatva',
        line1: 'Plot 22, Vatva GIDC Phase 3',
        line2: '',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '382445',
        phone: '+91 98765 11223',
        is_main: false
      },
      {
        id: 'ADDR-003',
        label: 'Site Office - Surat',
        line1: '9, Udhna Industrial Estate',
        line2: 'Near Ring Road',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '394210',
        phone: '+91 98765 44556',
        is_main: false
      }
    ];
  }

  private _initOrderHistory() {
    this.orderHistory = [
      { id: 'SO-2456', date: '28 Jun 2026', product: 'Hydraulic Cylinder x4', amount: '₹2,45,000', status: 'Delivered', status_color: 'success' },
      { id: 'SO-2431', date: '14 Jun 2026', product: 'Bearing Assembly x12', amount: '₹86,400', status: 'Delivered', status_color: 'success' },
      { id: 'SO-2402', date: '02 Jun 2026', product: 'Steel Pipe Fittings x30', amount: '₹1,12,500', status: 'Processing', status_color: 'info' },
      { id: 'SO-2378', date: '19 May 2026', product: 'Industrial Valve x8', amount: '₹1,98,000', status: 'Delivered', status_color: 'success' },
      { id: 'SO-2340', date: '30 Apr 2026', product: 'Conveyor Belt Roll x2', amount: '₹3,20,000', status: 'Cancelled', status_color: 'danger' }
    ];
  }

  private _initProductsPurchased() {
    this.productsPurchased = [
      { product: 'Hydraulic Cylinder', category: 'Hydraulics', qty: 18, last_ordered: '28 Jun 2026', total_spent: '₹9,80,000' },
      { product: 'Bearing Assembly', category: 'Mechanical', qty: 56, last_ordered: '14 Jun 2026', total_spent: '₹3,42,000' },
      { product: 'Steel Pipe Fittings', category: 'Piping', qty: 120, last_ordered: '02 Jun 2026', total_spent: '₹4,10,500' },
      { product: 'Industrial Valve', category: 'Mechanical', qty: 22, last_ordered: '19 May 2026', total_spent: '₹4,95,000' }
    ];
  }

  private _initOutstandingInvoices() {
    this.outstandingInvoices = [
      { invoice_id: 'INV-3312', order_id: 'SO-2402', amount: '₹1,12,500', due_date: '02 Jul 2026', days_overdue: 1, priority: 'High', priority_color: 'danger' },
      { invoice_id: 'INV-3290', order_id: 'SO-2378', amount: '₹49,500', due_date: '18 Jun 2026', days_overdue: 15, priority: 'High', priority_color: 'danger' },
      { invoice_id: 'INV-3265', order_id: 'SO-2340', amount: '₹23,000', due_date: '28 Jun 2026', days_overdue: 5, priority: 'Medium', priority_color: 'warning' }
    ];
  }

  private _initRecentActivities() {
    this.recentActivities = [
      { title: 'Invoice INV-3312 generated', subtitle: 'Order SO-2402 · ₹1,12,500', time: '2 days ago', icon: 'ri-bill-line', icon_bg_color: 'primary', badge: 'Invoice', badge_color: 'primary' },
      { title: 'Order SO-2456 delivered', subtitle: 'Hydraulic Cylinder x4', time: '5 days ago', icon: 'ri-truck-line', icon_bg_color: 'success', badge: 'Order', badge_color: 'success' },
      { title: 'New delivery address added', subtitle: 'Site Office - Surat', time: '9 days ago', icon: 'ri-map-pin-add-line', icon_bg_color: 'info', badge: 'Address', badge_color: 'info' },
      { title: 'Payment received', subtitle: '₹86,400 against INV-3280', time: '12 days ago', icon: 'ri-check-double-line', icon_bg_color: 'success', badge: 'Payment', badge_color: 'success' }
    ];
  }

  openAddAddress(content: any) {
    this.addressForm = { label: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '' };
    this.offcanvasService.open(content, { position: 'end' });
  }

  saveAddress(offcanvasRef: any) {
    // TODO: replace with AddressService.create() once available
    const newAddress = {
      id: 'ADDR-' + (this.deliveryAddresses.length + this.mainAddress ? this.deliveryAddresses.length + 4 : 1).toString().padStart(3, '0'),
      ...this.addressForm,
      is_main: false
    };
    this.deliveryAddresses.push(newAddress);
    offcanvasRef.close();
  }

  setAsMainAddress(address: any) {
    // TODO: replace with AddressService.setMain(address.id) once available
    const previousMain = this.mainAddress;
    previousMain.is_main = false;

    this.deliveryAddresses = this.deliveryAddresses.filter(a => a.id !== address.id);
    this.deliveryAddresses.push(previousMain);

    address.is_main = true;
    this.mainAddress = address;
  }

}