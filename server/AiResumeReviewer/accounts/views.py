from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserSerializer
from django.contrib.auth import get_user_model

# --- NEW IMPORTS FOR LOGIN ---
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

# 1. Registration View (Keep this as is)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser)

# 2. CUSTOM LOGIN SERIALIZER (This adds the missing data!)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default data is just 'access' and 'refresh'
        data = super().validate(attrs)
        
        # Now we ADD your custom data
        data['role'] = self.user.role
        data['username'] = self.user.username
        data['email'] = self.user.email
        
        # Handle Image URL safely
        if self.user.profile_image:
            data['profile_image'] = self.user.profile_image.url
        else:
            data['profile_image'] = "" 
            
        return data

# 3. CUSTOM LOGIN VIEW
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer