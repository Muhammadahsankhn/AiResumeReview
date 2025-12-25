from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile_image = serializers.ImageField(required=False) # <--- Allow image input

    class Meta:
        model = User
        # Add 'profile_image' and 'role' to fields
        fields = ('id', 'username', 'email', 'password', 'profile_image', 'role') 

    def create(self, validated_data):
        # Extract image and password
        password = validated_data.pop('password')
        
        # Create user safely
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        return user