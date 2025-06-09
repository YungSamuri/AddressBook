from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render
from django.conf  import settings
import json
import os
from django.contrib.auth.decorators import login_required
from .models import Contact, Household

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/manifest.json")
    MANIFEST = json.load(f)

# Create your views here.
@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)


@login_required
def new_contact(req):
    body = json.loads(req.body)
    errors = []
    if len(body.get("firstName")) < 1:
        errors.append("First name is required")
    if len(body.get("lastName")) < 1:
        errors.append("Last name is required")
    if len(body.get("household")) < 1 or body.get("household") == "None":
        errors.append("Household not found")
    else:
        try:
            household = Household.objects.get(name=body.get("household"))
        except:
            errors.append("Household not found")
    if len(body.get("address1")) < 1:
        errors.append("Address line 1 is required")
    if len(body.get("city")) < 1:
        errors.append("City is required")
    if len(body.get("state")) < 1:
        errors.append("State is required")
    if len(str(body.get("zip"))) != 5 or not str(body.get("zip")).isdigit():
        errors.append("Bad format for zip code")
    if len(body.get("country")) < 1:
        body["country"] = "United States"
    if len(body.get("email")) < 1:
        errors.append("Email is required")
    if len(str(body.get("cellPhone"))) < 10 or not str(body.get("cellPhone")).isdigit():
        errors.append("Bad format for cell phone")
    if len(str(body.get("workPhone"))) < 1:
        body["workPhone"] = body.get("cellPhone")
    elif len(str(body.get("workPhone"))) < 10 or not str(body.get("workPhone")).isdigit():
        errors.append("Bad format for work phone")

    if errors:
        return JsonResponse({"errors": errors}, status=400)
    
    contact = Contact.objects.create(
        firstName = body.get("firstName"),
        lastName = body.get("lastName"),
        household = household,
        addressLine1 = body.get("address1"),
        addressLine2 = body.get("address2"),
        city = body.get("city"),
        state = body.get("state"),
        zip = body.get("zip"),
        country = body.get("country"),
        email = body.get("email"),
        cellPhone = body.get("cellPhone"),
        workPhone = body.get("workPhone"),
        notes = body.get("notes"),
        user = req.user,
    )
    return JsonResponse({"contact": model_to_dict(contact)})


@login_required
def contacts_nosearch(req):
    return contacts(req, "")


@login_required
def contacts(req, search_term):
    contacts = Contact.objects.filter(user=req.user)
    contacts = contacts.filter(firstName__startswith=search_term)
    return JsonResponse({"contacts": [model_to_dict(contact) for contact in contacts]})
    

@login_required
def new_household(req):
    body = json.loads(req.body)
    household = Household.objects.create(
        name = body["householdName"],
        user = req.user,
    )
    return JsonResponse({"household": model_to_dict(household)})


@login_required
def households(req):
    households = [model_to_dict(household) for household in Household.objects.filter(user=req.user)]
    return JsonResponse({"households": households})


@login_required
def contact(req, contact_id):
    try:
        contact = Contact.objects.get(id=contact_id)
    except Contact.DoesNotExist:
        return JsonResponse({"error": "Contact not found"}, status=404)
    

    if contact.user != req.user:
        return JsonResponse({"error": "Contact not owned by current user"}, status=404)

    household = Household.objects.get(id=contact.household.id)
    householdMembers = Contact.objects.filter(household=contact.household).exclude(id=contact.id)
    
    return JsonResponse({"contact": model_to_dict(contact), 
                            "household": model_to_dict(household), 
                            "householdMembers": [model_to_dict(member) for member in householdMembers]})
    
    
@login_required
def edit_contact(req, contact_id):
    try:
        contact = Contact.objects.get(id=contact_id)
    except Contact.DoesNotExist:
        return JsonResponse({"error": "Contact not found"}, status=404)
    
    if contact.user != req.user:
        return JsonResponse({"error": "Contact not owned by current user"}, status=404)
    
    body = json.loads(req.body)
    errors = []
    if len(body.get("firstName")) < 1:
        errors.append("First name is required")
    if len(body.get("lastName")) < 1:
        errors.append("Last name is required")
    if len(body.get("household")) < 1 or body.get("household") == "None":
        errors.append("Household not found")
    else:
        try:
            household = Household.objects.get(name=body.get("household"))
        except:
            errors.append("Household not found")
    if len(body.get("address1")) < 1:
        errors.append("Address line 1 is required")
    if len(body.get("city")) < 1:
        errors.append("City is required")
    if len(body.get("state")) < 1:
        errors.append("State is required")
    if len(str(body.get("zip"))) != 5 or not str(body.get("zip")).isdigit():
        errors.append("Bad format for zip code")
    if len(body.get("country")) < 1:
        body["country"] = "United States"
    if len(body.get("email")) < 1:
        errors.append("Email is required")
    if len(str(body.get("cellPhone"))) < 10 or not str(body.get("cellPhone")).isdigit():
        errors.append("Bad format for cell phone")
    if len(str(body.get("workPhone"))) < 1:
        body["workPhone"] = body.get("cellPhone")
    elif len(str(body.get("workPhone"))) < 10 or not str(body.get("workPhone")).isdigit():
        errors.append("Bad format for work phone")

    if errors:
        return JsonResponse({"errors": errors}, status=400)
    for key, value in body.items():
        if key == "household":
            contact.household = household
        else:
            setattr(contact, key, value)
    contact.save()
    return JsonResponse({"contact": model_to_dict(contact)})


@login_required
def delete_contact(req, contact_id):
    try:
        contact = Contact.objects.get(id=contact_id)
    except:
        return JsonResponse({"error": "Contact not found"}, status=404)

    if contact.user != req.user:
        return JsonResponse({"error": "Contact not owned by current user"}, status=404)

    contact.delete()

    return JsonResponse({"success": True})
    
    