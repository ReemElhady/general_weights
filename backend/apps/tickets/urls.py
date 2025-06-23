from django.urls import path
from . import views

urlpatterns = [
    path("first-weight/", views.TicketFirstWeightAPIView.as_view(), name="first-weight"),
    path('<int:pk>/second-weight/', views.TicketSecondWeightAPIView.as_view(), name='second-weight'),
    path('', views.TicketListAPIView.as_view(), name='ticket-list'),
    path('incomplete/', views.IncompleteTicketsListAPIView.as_view(), name='ticket-list'),
    path('<int:pk>/', views.TicketRetrieveAPIView.as_view(), name='ticket-retrieve'),
    path('<int:pk>/delete/', views.TicketDeleteAPIView.as_view(), name='ticket-delete'),

    # Analytics URLs
    path('analytics/yearly/', views.TicketYearlyAnalyticsAPIView.as_view(), name='ticket-yearly-analytics'),
    path("analytics/summary/", views.TicketSummaryAnalyticsAPIView.as_view(), name="ticket-summary-analytics"),


]