from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
# Import your CUSTOM view
from accounts.views import RegisterView, CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('jobs/', include('jobs.urls')),
    
   #login api
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)