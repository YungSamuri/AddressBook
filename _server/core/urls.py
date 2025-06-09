from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('contacts/', view=views.contacts_nosearch, name="contacts"),
    path('contacts/<str:search_term>/', view=views.contacts, name="contacts"),
    path('new-contact/', view=views.new_contact, name="new_contact"),
    path('households/', view=views.households, name="households"),
    path('new-household/', view=views.new_household, name="new_household"),
    path('contact/<int:contact_id>/', view=views.contact, name="contact"),
    path('contact/<int:contact_id>/delete', view=views.delete_contact, name="contact"),
    path('contact/<int:contact_id>/edit', view=views.edit_contact, name="contact"),
]