from django.shortcuts import render, redirect
from .models import *
from django.contrib import messages
from django.http import HttpResponse
import requests
from django.http import JsonResponse
import json

# main page function

def index(request):
    if not request.user.is_authenticated:
        return redirect("login")

    # payload = {
    #     "key": "DMNWLZTDRQ",
    #     "postcode": "NW67YD",
    #     "finish_quality": "medium"
    # }

    


    # print(json.loads(res.text))

    return render(request, 'main.html')


def get_gdv(request):
    if request.method == "GET":
        if request.is_ajax():
            myData = request.GET['myData']
            myData = json.loads(myData)
            myData['key'] = "DMNWLZTDRQ"

            url = "https://api.propertydata.co.uk/development-gdv"
            res = requests.get(url, params = myData)

            result = json.loads(res.text)

            print(result)
            # print(myData)

            output = result

    return JsonResponse(output)
# function for signup

def get_buildcost(request):
    if request.method == "GET":
        if request.is_ajax():
            myData = request.GET['myData']
            myData = json.loads(myData)
            myData['key'] = "DMNWLZTDRQ"

            url = "https://api.propertydata.co.uk/build-cost"
            res = requests.get(url, params = myData)

            result = json.loads(res.text)

            print(result)
            # print(myData)

            output = result

    return JsonResponse(output)

def signup(request):
    if request.method == "POST":
        name = request.POST['name']
        l_name = request.POST['l_name']
        email = request.POST['email']
        pass1 = request.POST['pass1']
        pass2 = request.POST['pass2']
        context = {
            "name":name,
            "l_name":l_name,
            "email":email,
            "pass1":pass1,
            "pass2":pass2,
        }
        if pass1==pass2:
            if User.objects.filter(username=email).exists():
                print("Email already taken")
                messages.info(request, "Entered number already in use!")
                context['border'] = "email" 
                return render(request, "signup.html", context)

            user = User.objects.create_user(username=email, first_name=name, password=pass1, last_name=l_name)
            user.save()
            
            return redirect("login")
        else:
            messages.info(request, "Your pasword doesn't match!")
            context['border'] = "password"
            return render(request, "signup.html", context)


    
    return render(request, "signup.html")


# function for login

def login(request):

    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['password']
        user = auth.authenticate(username=email, password=password)
        if user is not None:
            auth.login(request, user)
            return redirect("index")
        else:
            messages.info(request, "Incorrect login details!")
            return redirect("login")
    else:
        return render(request, "login.html")


# function for logout

def logout(request):
    auth.logout(request)
    return redirect("index")

