from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Scale, Client, Item
from .serializers import ScaleSerializer, ClientSerializer, ItemSerializer
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from apps.utils.api_filters import apply_search_order_pagination

class ScaleListCreateAPIView(APIView):

    def get(self, request):
        scales = Scale.objects.all()
        result = apply_search_order_pagination(
            queryset=scales,
            request=request,
            search_fields=['name', 'manufacturer', 'model'],
            ordering_fields=['id', 'name', 'manufacturer', 'model', 'connection_type']
        )


        serializer = ScaleSerializer(result['results'], many=True)
        return Response({
            'count': result['count'],
            'total_pages': result['total_pages'],
            'current_page': result['current_page'],
            'results': serializer.data
        })

    def post(self, request):
        serializer = ScaleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScaleDetailAPIView(APIView):

    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [IsAdminUser()]
        return [IsAuthenticated()]


    def get_object(self, pk):
        return get_object_or_404(Scale, pk=pk)

    def get(self, request, pk):
        scale = self.get_object(pk)
        serializer = ScaleSerializer(scale)
        return Response(serializer.data)

    def put(self, request, pk):
        scale = self.get_object(pk)
        serializer = ScaleSerializer(scale, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        scale = self.get_object(pk)
        serializer = ScaleSerializer(scale, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        scale = self.get_object(pk)
        scale.delete()
        return Response(status=status.HTTP_200_OK)


class ClientListCreateAPIView(APIView):

    def get(self, request):
        clients = Client.objects.all()
        result = apply_search_order_pagination(
            queryset=clients,
            request=request,
            search_fields=['name', 'name', 'phone', 'email'],
            ordering_fields=['id', 'name', 'joined_at']
        )

        serializer = ClientSerializer(result['results'], many=True)

        return Response({
            'count': result['count'],
            'total_pages': result['total_pages'],
            'current_page': result['current_page'],
            'results': serializer.data
        })

    def post(self, request):
        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClientDetailAPIView(APIView):

    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_object(self, pk):
        return get_object_or_404(Client, pk=pk)

    def get(self, request, pk):
        client = self.get_object(pk)
        serializer = ClientSerializer(client)
        return Response(serializer.data)

    def put(self, request, pk):
        client = self.get_object(pk)
        serializer = ClientSerializer(client, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        client = self.get_object(pk)
        client.delete()
        return Response(status=status.HTTP_200_OK)


class ItemListCreateAPIView(APIView):

    def get(self, request):
        items = Item.objects.all()

        result = apply_search_order_pagination(
            queryset=items,
            request=request,
            search_fields=['name', 'name', 'sector', 'type'],
            ordering_fields=['id', 'name', 'sector', 'type']
        )


        serializer = ItemSerializer(result['results'], many=True)
        return Response({
            'count': result['count'],
            'total_pages': result['total_pages'],
            'current_page': result['current_page'],
            'results': serializer.data
        })

    def post(self, request):
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ItemDetailAPIView(APIView):
    def get_permissions(self):
        if self.request.method in ['PUT', 'DELETE']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_object(self, pk):
        return get_object_or_404(Item, pk=pk)

    def get(self, request, pk):
        item = self.get_object(pk)
        serializer = ItemSerializer(item)
        return Response(serializer.data)

    def put(self, request, pk):
        item = self.get_object(pk)
        serializer = ItemSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        item = self.get_object(pk)
        item.delete()
        return Response(status=status.HTTP_200_OK)


class ScaleStatsAPIView(APIView):

    def get(self, request):
        total_scales = Scale.objects.count()
        active_scales = Scale.objects.filter(status=True).count()

        return Response({
            "total_scales": total_scales,
            "active_scales": active_scales
        })

