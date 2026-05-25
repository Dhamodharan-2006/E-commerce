from rest_framework import serializers
from .models import Product, Category
import cloudinary

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.image:
            return cloudinary.CloudinaryImage(str(obj.image)).build_url()
        return None

    class Meta:
        model = Product
        fields = '__all__'